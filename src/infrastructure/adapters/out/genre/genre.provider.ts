import { type Genre, type GenreFilters, GenreSchema } from '@trackplay/catalog-domain'
import { type Logger } from '@trackplay/core'
import { type IGDBFetch } from '../helpers/http/igdb.http.ts'
import { createProviderMapper } from '../helpers/mappers/provider.mapper.ts'
import { type BuildIGDBQuery } from '../helpers/query/igdb.query.ts'
import { ROUTES } from '#constants/routes.constant'
import { IGDB } from '#igdbConstants/igdb.constant'
import { IGDBGenreListSchema } from '#igdbSchemas/genre.schema'
import { type IGDBGenre } from '#igdbTypes/genre.type'
import { type GenreProviderPort } from '#ports/genre.port'

const endpoint = ROUTES.IGDB.GENRES
const fields = IGDB.GENRES.FIELDS
const mapper = createProviderMapper<IGDBGenre, Genre>(GenreSchema)

export const igdbGenreAdapter = (fetch: IGDBFetch, buildQuery: BuildIGDBQuery, logger: Logger): GenreProviderPort => {
  const getGenres = async (filters: GenreFilters): Promise<Genre[]> => {
    const query = buildQuery(fields, filters)

    const genres = await fetch({
      endpoint,
      query,
      schema: IGDBGenreListSchema,
    })

    return mapper.toDomainList(genres, logger)
  }

  return {
    getGenres,
  }
}
