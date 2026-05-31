import { CollectionFiltersSchema } from '@trackplay/catalog-domain'
import { HTTP_STATUS, IdSchema, validateSchema } from '@trackplay/core'
import type { TrackPlayRequest, TrackPlayResponse } from '@trackplay/runtime'
import { type CollectionUseCase } from '#useCases/collection.usecase'

export interface CollectionController {
  getCollections(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
  getCollectionById(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
}

export const collectionController = (collectionUseCase: CollectionUseCase): CollectionController => {
  const getCollections = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const filters = validateSchema(CollectionFiltersSchema, req.query, { i18nKey: 'catalog.filters.invalid_format' })
    const collections = await collectionUseCase.getCollections(filters)
    res.status(HTTP_STATUS.OK).json(collections)
  }

  const getCollectionById = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const id = validateSchema(IdSchema, req.params.id, { i18nKey: 'catalog.collections.invalid_id' })
    const collection = await collectionUseCase.getCollectionById(id)
    res.status(HTTP_STATUS.OK).json(collection)
  }

  return {
    getCollections,
    getCollectionById,
  }
}
