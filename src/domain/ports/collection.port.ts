import type { Collection, CollectionFilters } from '@trackplay/catalog-domain'
import { type Id } from '@trackplay/core'
import { type CachedEntity } from '#types/cache.type'

export interface CollectionProviderPort {
  getCollections(filters: CollectionFilters): Promise<Collection[]>
  getCollectionById(id: Id): Promise<Collection | null>
}

export interface CollectionRepositoryPort {
  save(collection: Collection): Promise<void>
  saveMany(collections: Collection[]): Promise<void>
  findById(id: Id): Promise<CachedEntity<Collection> | null>
}
