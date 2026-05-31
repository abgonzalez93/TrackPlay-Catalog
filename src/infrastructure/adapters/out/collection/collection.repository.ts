import { type Collection, CollectionSchema } from '@trackplay/catalog-domain'
import { type Id } from '@trackplay/core'
import { createPersistenceMapper } from '../helpers/mappers/persistence.mapper.ts'
import { type CollectionRepositoryPort } from '#ports/collection.port'
import { type PrismaClient, type Collection as PrismaCollection } from '#prisma/client'
import { type CachedEntity } from '#types/cache.type'

const mapper = createPersistenceMapper<Collection, PrismaCollection>(CollectionSchema)

export const prismaCollectionRepository = (prisma: PrismaClient): CollectionRepositoryPort => {
  const saveMany = async (collections: Collection[]): Promise<void> => {
    if (collections.length === 0) return

    const now = new Date()
    const operations = collections.map((collection) => {
      const data = mapper.toPersistence(collection)
      return prisma.collection.upsert({
        where: { igdbId: data.igdbId },
        update: { ...data, lastSyncAt: now },
        create: { ...data, lastSyncAt: now },
      })
    })

    await prisma.$transaction(operations)
  }

  const save = async (collection: Collection): Promise<void> => saveMany([collection])

  const findById = async (id: Id): Promise<CachedEntity<Collection> | null> => {
    const collection = await prisma.collection.findUnique({
      where: { igdbId: id },
    })

    if (!collection) return null

    return {
      data: mapper.toDomain(collection),
      lastSyncAt: collection.lastSyncAt,
    }
  }

  return {
    save,
    saveMany,
    findById,
  }
}
