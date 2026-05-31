import { type Collection, type CollectionFilters, CollectionSchema } from '@trackplay/catalog-domain'
import { type Id, type Logger } from '@trackplay/core'
import { type IGDBFetch } from '../helpers/http/igdb.http.ts'
import { createProviderMapper } from '../helpers/mappers/provider.mapper.ts'
import { type BuildIGDBQuery } from '../helpers/query/igdb.query.ts'
import { ROUTES } from '#constants/routes.constant'
import { IGDB } from '#igdbConstants/igdb.constant'
import { IGDBCollectionListSchema } from '#igdbSchemas/collection.schema'
import { type IGDBCollection } from '#igdbTypes/collection.type'
import { type CollectionProviderPort } from '#ports/collection.port'

const endpoint = ROUTES.IGDB.COLLECTIONS
const fields = IGDB.COLLECTIONS.FIELDS

const mapper = createProviderMapper<IGDBCollection, Collection>(CollectionSchema)

export const igdbCollectionAdapter = (
  fetch: IGDBFetch,
  buildQuery: BuildIGDBQuery,
  logger: Logger,
): CollectionProviderPort => {
  const getCollections = async (filters: CollectionFilters): Promise<Collection[]> => {
    const query = buildQuery(fields, filters)

    const collections = await fetch({
      endpoint,
      query,
      schema: IGDBCollectionListSchema,
    })

    return mapper.toDomainList(collections, logger)
  }

  const getCollectionById = async (id: Id): Promise<Collection | null> => {
    const query = buildQuery(fields, { where: `id = ${id}` })

    const [collection] = await fetch({
      endpoint,
      query,
      schema: IGDBCollectionListSchema,
    })

    return collection ? mapper.toDomain(collection) : null
  }

  return {
    getCollections,
    getCollectionById,
  }
}
