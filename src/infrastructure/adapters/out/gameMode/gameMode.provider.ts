import { type GameMode, type GameModeFilters, GameModeSchema } from '@trackplay/catalog-domain'
import { type Logger } from '@trackplay/core'
import { type IGDBFetch } from '../helpers/http/igdb.http.ts'
import { createProviderMapper } from '../helpers/mappers/provider.mapper.ts'
import { type BuildIGDBQuery } from '../helpers/query/igdb.query.ts'
import { ROUTES } from '#constants/routes.constant'
import { IGDB } from '#igdbConstants/igdb.constant'
import { IGDBGameModeListSchema } from '#igdbSchemas/gameMode.schema'
import { type IGDBGameMode } from '#igdbTypes/gameMode.type'
import { type GameModeProviderPort } from '#ports/gameMode.port'

const endpoint = ROUTES.IGDB.GAME_MODES
const fields = IGDB.GAME_MODES.FIELDS
const mapper = createProviderMapper<IGDBGameMode, GameMode>(GameModeSchema)

export const igdbGameModeAdapter = (fetch: IGDBFetch, buildQuery: BuildIGDBQuery, logger: Logger): GameModeProviderPort => {
  const getGameModes = async (filters: GameModeFilters): Promise<GameMode[]> => {
    const query = buildQuery(fields, filters)

    const gameModes = await fetch({
      endpoint,
      query,
      schema: IGDBGameModeListSchema,
    })

    return mapper.toDomainList(gameModes, logger)
  }

  return {
    getGameModes,
  }
}
