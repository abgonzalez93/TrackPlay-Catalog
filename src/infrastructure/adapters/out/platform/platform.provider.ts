import { type Platform, type PlatformFilters, PlatformSchema } from '@trackplay/catalog-domain'
import { type Logger } from '@trackplay/core'
import { type IGDBFetch } from '../helpers/http/igdb.http.ts'
import { createProviderMapper } from '../helpers/mappers/provider.mapper.ts'
import { type BuildIGDBQuery } from '../helpers/query/igdb.query.ts'
import { ROUTES } from '#constants/routes.constant'
import { IGDB } from '#igdbConstants/igdb.constant'
import { IGDBPlatformListSchema } from '#igdbSchemas/platform.schema'
import { type IGDBPlatform } from '#igdbTypes/platform.type'
import { type PlatformProviderPort } from '#ports/platform.port'

const endpoint = ROUTES.IGDB.PLATFORMS
const fields = IGDB.PLATFORMS.FIELDS
const mapper = createProviderMapper<IGDBPlatform, Platform>(PlatformSchema)

export const igdbPlatformAdapter = (fetch: IGDBFetch, buildQuery: BuildIGDBQuery, logger: Logger): PlatformProviderPort => {
  const getPlatforms = async (filters: PlatformFilters): Promise<Platform[]> => {
    const query = buildQuery(fields, filters)

    const platforms = await fetch({
      endpoint,
      query,
      schema: IGDBPlatformListSchema,
    })

    return mapper.toDomainList(
      platforms.map((p) => ({ ...p, logo: p.platform_logo })),
      logger,
    )
  }

  return {
    getPlatforms,
  }
}
