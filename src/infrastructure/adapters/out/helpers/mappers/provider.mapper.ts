import { validateSchema, isRecord, ExternalServiceError, serializeError, type Logger } from '@trackplay/core'
import { z } from 'zod'
import { isJsonType } from './mapper.helper.ts'

const CAMEL_TO_SNAKE_REGEX = /[A-Z]/g
const toSnakeCase = (str: string) => str.replace(CAMEL_TO_SNAKE_REGEX, (letter) => `_${letter.toLowerCase()}`)

const hasKeys = (schema: unknown, keys: string[]): boolean => {
  if (!(schema instanceof z.ZodObject)) return false
  const shape = schema.shape
  return keys.every((key) => key in shape)
}

const isImageType = (schema: unknown): boolean => hasKeys(schema, ['sm', 'md', 'lg'])
const isVideoType = (schema: unknown): boolean => hasKeys(schema, ['videoId'])

const transformDate = (value: unknown): Date | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value * 1000)
  return undefined
}

const transformImage = (value: unknown): Record<string, unknown> | undefined => {
  if (!isRecord(value)) return undefined

  const { id, url } = value
  if (typeof id !== 'number' || typeof url !== 'string') return undefined

  const baseUrl = url.startsWith('//') ? `https:${url}` : url

  return {
    id,
    sm: baseUrl.replace('t_thumb', 't_cover_small'),
    md: baseUrl.replace('t_thumb', 't_cover_big'),
    lg: baseUrl.replace('t_thumb', 't_1080p'),
  }
}

const transformVideo = (value: unknown): Record<string, unknown> | undefined => {
  if (!isRecord(value)) return undefined

  const { id, video_id, name } = value
  if (typeof id !== 'number' || typeof video_id !== 'string') return undefined

  return {
    id,
    name,
    videoId: video_id,
  }
}

const mapValue = (value: unknown, schema: unknown): unknown => {
  if (value === null || value === undefined) return undefined

  if (typeof value === 'string' && isJsonType(schema)) {
    try {
      return mapValue(JSON.parse(value), schema)
    } catch {
      return undefined
    }
  }

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    const inner: unknown = schema.unwrap()
    return mapValue(value, inner)
  }

  if (schema instanceof z.ZodArray) {
    if (!Array.isArray(value)) return undefined
    const element: unknown = schema.element
    return value.map((item) => mapValue(item, element)).filter((i) => i !== undefined)
  }

  if (schema instanceof z.ZodDate) return transformDate(value)

  if (schema instanceof z.ZodObject) {
    if (isImageType(schema)) return transformImage(value)
    if (isVideoType(schema)) return transformVideo(value)
    if (!isRecord(value)) return undefined

    const shape = schema.shape
    const result: Record<string, unknown> = {}

    for (const key of Object.keys(shape)) {
      const fieldSchema = shape[key]

      let sourceValue = value[key]
      if (sourceValue === undefined) sourceValue = value[toSnakeCase(key)]

      const mapped = mapValue(sourceValue, fieldSchema)
      if (mapped !== undefined) result[key] = mapped
    }

    return result
  }

  return value
}

export interface ProviderMapper<Provider, Domain> {
  toDomain: (provider: Provider) => Domain
  toDomainList: (sources: Provider[], logger?: Logger) => Domain[]
}

export const createProviderMapper = <Provider, Domain>(schema: z.ZodSchema<Domain>): ProviderMapper<Provider, Domain> => {
  const toDomain = (provider: Provider): Domain => {
    if (provider == null) throw new ExternalServiceError({ i18nKey: 'catalog.mapper.provider_data_null' })
    const domain = mapValue(provider, schema)
    return validateSchema(schema, domain, { ErrorClass: ExternalServiceError })
  }

  const toDomainList = (sources: Provider[], logger?: Logger): Domain[] => {
    if (!Array.isArray(sources)) return []

    const results: Domain[] = []
    const errors: { index: number; error: unknown }[] = []

    for (let i = 0; i < sources.length; i++) {
      const item = sources[i]
      if (item == null) continue

      try {
        results.push(toDomain(item))
      } catch (error) {
        errors.push({ index: i, error })
      }
    }

    if (errors.length > 0 && logger) {
      logger.warn('Some items failed validation during mapping', {
        total: sources.length,
        failed: errors.length,
        successful: results.length,
        errors: errors.map(({ index, error }) => ({
          index,
          error: serializeError(error),
        })),
      })
    }

    return results
  }

  return { toDomain, toDomainList }
}
