import type { Collection, CollectionFilters } from '@trackplay/catalog-domain'
import { type Id, type Logger, NotFoundError } from '@trackplay/core'
import { isStale, revalidateInBackground } from './helpers/cache.helper.ts'
import type { CollectionProviderPort, CollectionRepositoryPort } from '#ports/collection.port'

export interface CollectionUseCase {
  getCollections(filters: CollectionFilters): Promise<Collection[]>
  getCollectionById(id: Id): Promise<Collection>
}

export const collectionUseCase = (
  provider: CollectionProviderPort,
  repository: CollectionRepositoryPort,
  logger: Logger,
): CollectionUseCase => {
  const getCollections = async (filters: CollectionFilters): Promise<Collection[]> => {
    const collections = await provider.getCollections(filters)

    if (collections.length > 0) {
      void repository.saveMany(collections).catch((error) => {
        logger.error('Failed to save collections batch', { count: collections.length, error })
      })
    }

    return collections
  }

  const getCollectionById = async (id: Id): Promise<Collection> => {
    const cached = await repository.findById(id)

    if (cached) {
      if (isStale(cached.lastSyncAt)) {
        revalidateInBackground({
          id,
          fetch: provider.getCollectionById,
          save: repository.save,
          logger,
          entityName: 'collection',
        })
      }
      return cached.data
    }

    const externalCollection = await provider.getCollectionById(id)

    if (externalCollection) {
      void repository.save(externalCollection).catch((error) => {
        logger.error('Failed to save collection', { id, error })
      })

      return externalCollection
    }

    throw new NotFoundError({ i18nKey: 'catalog.collections.not_found' })
  }

  return {
    getCollections,
    getCollectionById,
  }
}
