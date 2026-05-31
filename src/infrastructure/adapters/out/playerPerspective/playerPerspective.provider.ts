import { type PlayerPerspective, type PlayerPerspectiveFilters, PlayerPerspectiveSchema } from '@trackplay/catalog-domain'
import { type Logger } from '@trackplay/core'
import { type IGDBFetch } from '../helpers/http/igdb.http.ts'
import { createProviderMapper } from '../helpers/mappers/provider.mapper.ts'
import { type BuildIGDBQuery } from '../helpers/query/igdb.query.ts'
import { ROUTES } from '#constants/routes.constant'
import { IGDB } from '#igdbConstants/igdb.constant'
import { IGDBPlayerPerspectiveListSchema } from '#igdbSchemas/playerPerspective.schema'
import { type IGDBPlayerPerspective } from '#igdbTypes/playerPerspective.type'
import { type PlayerPerspectiveProviderPort } from '#ports/playerPerspective.port'

const endpoint = ROUTES.IGDB.PLAYER_PERSPECTIVES
const fields = IGDB.PLAYER_PERSPECTIVES.FIELDS
const mapper = createProviderMapper<IGDBPlayerPerspective, PlayerPerspective>(PlayerPerspectiveSchema)

export const igdbPlayerPerspectiveAdapter = (
  fetch: IGDBFetch,
  buildQuery: BuildIGDBQuery,
  logger: Logger,
): PlayerPerspectiveProviderPort => {
  const getPlayerPerspectives = async (filters: PlayerPerspectiveFilters): Promise<PlayerPerspective[]> => {
    const query = buildQuery(fields, filters)

    const playerPerspectives = await fetch({
      endpoint,
      query,
      schema: IGDBPlayerPerspectiveListSchema,
    })

    return mapper.toDomainList(playerPerspectives, logger)
  }

  return {
    getPlayerPerspectives,
  }
}
