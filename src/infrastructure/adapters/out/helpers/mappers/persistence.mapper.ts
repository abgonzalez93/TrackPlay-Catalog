import { validateSchema, isRecord, type Id, PersistenceError } from '@trackplay/core'
import { z } from 'zod'
import { isJsonType, unwrapSchema } from './mapper.helper.ts'
import { Prisma } from '#prisma/client'
import { type NamedResource } from '@trackplay/catalog-domain'

interface PrismaIdentifiable {
  igdbId: Id
  createdAt?: Date
  updatedAt?: Date
  lastSyncAt?: Date
}

interface PersistenceData {
  igdbId: Id
  name: string
  slug: string
  [key: string]: unknown
}

type RelationKind =
  | { type: 'oneToOne' }
  | { type: 'simpleMany'; relationName: string }
  | { type: 'complexMany'; entityField: string }

const getShape = (schema: unknown): Record<string, unknown> | null => {
  if (!(schema instanceof z.ZodObject)) return null
  const shape: unknown = schema.shape
  return isRecord(shape) ? shape : null
}

const getArrayElement = (schema: unknown): unknown => {
  if (!(schema instanceof z.ZodArray)) return null
  const element: unknown = schema.element
  return element ?? null
}

const hasNamedResourceShape = (schema: unknown): boolean => {
  const shape = getShape(unwrapSchema(schema))
  return shape !== null && 'id' in shape && 'name' in shape && 'slug' in shape
}

const findEntityField = (schema: unknown): string | null => {
  const shape = getShape(schema)
  if (!shape) return null
  for (const key of Object.keys(shape)) {
    if (key === 'id') continue
    if (hasNamedResourceShape(shape[key])) return key
  }
  return null
}

const classifyFields = (schema: z.ZodType, scalarFieldEnum?: Record<string, string>) => {
  const jsonFields = new Set<string>()
  const relations = new Map<string, RelationKind>()
  const complexElementKeys = new Map<string, Set<string>>()

  if (!(schema instanceof z.ZodObject)) return { jsonFields, relations, complexElementKeys }

  const shape = schema.shape
  const scalarKeys = scalarFieldEnum ? new Set(Object.keys(scalarFieldEnum)) : null

  for (const key of Object.keys(shape)) {
    if (key === 'id') continue
    const fieldSchema = shape[key]

    if (!scalarKeys) {
      if (isJsonType(fieldSchema)) jsonFields.add(key)
      continue
    }

    if (scalarKeys.has(key)) {
      if (isJsonType(fieldSchema)) jsonFields.add(key)
      continue
    }

    if (scalarKeys.has(`${key}Id`)) {
      relations.set(key, { type: 'oneToOne' })
      continue
    }

    const unwrapped = unwrapSchema(fieldSchema)
    const arrayElement = unwrapSchema(getArrayElement(unwrapped))

    if (arrayElement) {
      if (hasNamedResourceShape(arrayElement)) {
        relations.set(key, { type: 'simpleMany', relationName: key.slice(0, -1) })
        continue
      }

      const elementShape = getShape(arrayElement)
      if (elementShape) {
        const entityField = findEntityField(arrayElement)
        if (entityField) {
          complexElementKeys.set(key, new Set(Object.keys(elementShape)))
          relations.set(key, { type: 'complexMany', entityField })
          continue
        }
      }
    }

    if (hasNamedResourceShape(unwrapped)) {
      relations.set(key, { type: 'oneToOne' })
      continue
    }

    if (isJsonType(fieldSchema)) jsonFields.add(key)
  }

  return { jsonFields, relations, complexElementKeys }
}

const isNamedResource = (value: unknown): value is NamedResource =>
  isRecord(value) && typeof value.id === 'number' && typeof value.name === 'string' && typeof value.slug === 'string'

const toConnectOrCreate = (resource: NamedResource) => ({
  where: { igdbId: resource.id },
  create: { igdbId: resource.id, name: resource.name, slug: resource.slug },
})

const SYSTEM_FIELDS = new Set(['id', 'igdbId', 'createdAt', 'updatedAt', 'lastSyncAt'])

const mapRelatedEntity = (record: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = { id: record.igdbId }
  for (const [key, value] of Object.entries(record)) {
    if (SYSTEM_FIELDS.has(key)) continue
    result[key] = value === null ? undefined : value
  }
  return result
}

export const createPersistenceMapper = <Domain extends NamedResource, PrismaEntity extends PrismaIdentifiable>(
  schema: z.ZodType<Domain>,
  scalarFieldEnum?: Record<string, string>,
) => {
  const { jsonFields, relations, complexElementKeys } = classifyFields(schema, scalarFieldEnum)

  const toPersistence = (domain: Domain): PersistenceData => {
    if (!domain) throw new PersistenceError({ i18nKey: 'catalog.mapper.domain_entity_null' })

    const { id, name, slug, ...rest } = domain
    const persistence: PersistenceData = { igdbId: id, name, slug }

    for (const [key, value] of Object.entries(rest)) {
      const relation = relations.get(key)

      if (value == null) {
        if (relation) continue
        persistence[key] = jsonFields.has(key) ? Prisma.JsonNull : null
        continue
      }

      if (relation) {
        switch (relation.type) {
          case 'oneToOne': {
            if (isNamedResource(value)) {
              persistence[key] = { connectOrCreate: toConnectOrCreate(value) }
            }
            break
          }

          case 'simpleMany': {
            if (Array.isArray(value)) {
              const validResources = value.filter(isNamedResource)
              if (validResources.length > 0) {
                persistence[key] = {
                  create: validResources.map((resource) => ({
                    [relation.relationName]: { connectOrCreate: toConnectOrCreate(resource) },
                  })),
                }
              }
            }
            break
          }

          case 'complexMany': {
            if (Array.isArray(value)) {
              const items = value.filter(isRecord)
              if (items.length > 0) {
                persistence[key] = {
                  create: items.map((item) => {
                    const result: Record<string, unknown> = {}
                    for (const [k, v] of Object.entries(item)) {
                      if (k === 'id') continue
                      if (k === relation.entityField && isNamedResource(v)) {
                        result[k] = { connectOrCreate: toConnectOrCreate(v) }
                      } else if (v != null) {
                        result[k] = v
                      }
                    }
                    return result
                  }),
                }
              }
            }
            break
          }
        }
        continue
      }

      persistence[key] = value
    }

    return persistence
  }

  const forUpdate = (data: PersistenceData): PersistenceData => {
    const result = { ...data }

    for (const [key, relation] of relations) {
      if (relation.type === 'oneToOne') continue

      const value = result[key]
      if (isRecord(value)) {
        result[key] = { deleteMany: {}, ...value }
      } else if (!(key in result)) {
        result[key] = { deleteMany: {} }
      }
    }

    return result
  }

  const toDomain = (persistence: PrismaEntity): Domain => {
    if (!persistence) throw new PersistenceError({ i18nKey: 'catalog.mapper.persistence_entity_null' })

    const { igdbId, createdAt, updatedAt, lastSyncAt, ...rest } = persistence
    const domain: Record<string, unknown> = { id: igdbId }

    for (const [key, value] of Object.entries(rest)) {
      if (key === 'id') continue

      const relation = relations.get(key)

      if (relation) {
        switch (relation.type) {
          case 'oneToOne': {
            if (isRecord(value)) {
              domain[key] = mapRelatedEntity(value)
            }
            break
          }

          case 'simpleMany': {
            if (Array.isArray(value)) {
              domain[key] = value
                .map((join) => {
                  const related = isRecord(join) ? join[relation.relationName] : null
                  if (!isRecord(related)) return null
                  return mapRelatedEntity(related)
                })
                .filter(Boolean)
            }
            break
          }

          case 'complexMany': {
            if (Array.isArray(value)) {
              const domainKeys = complexElementKeys.get(key)
              if (!domainKeys) break

              domain[key] = value
                .map((join) => {
                  if (!isRecord(join)) return null

                  const result: Record<string, unknown> = {}
                  for (const dk of domainKeys) {
                    if (dk === 'id') {
                      const entity = join[relation.entityField]
                      if (isRecord(entity)) result.id = entity.igdbId
                    } else if (dk === relation.entityField) {
                      const entity = join[dk]
                      if (isRecord(entity)) result[dk] = mapRelatedEntity(entity)
                    } else if (dk in join) {
                      result[dk] = join[dk]
                    }
                  }

                  return result
                })
                .filter(Boolean)
            }
            break
          }
        }
        continue
      }

      domain[key] = value === null ? undefined : value
    }

    return validateSchema(schema, domain, { ErrorClass: PersistenceError })
  }

  const buildInclude = (): Record<string, unknown> | undefined => {
    if (relations.size === 0) return undefined

    const result: Record<string, unknown> = {}
    for (const [key, relation] of relations) {
      switch (relation.type) {
        case 'oneToOne':
          result[key] = true
          break
        case 'simpleMany':
          result[key] = { include: { [relation.relationName]: true } }
          break
        case 'complexMany':
          result[key] = { include: { [relation.entityField]: true } }
          break
      }
    }
    return result
  }

  return { toPersistence, forUpdate, toDomain, buildInclude }
}
