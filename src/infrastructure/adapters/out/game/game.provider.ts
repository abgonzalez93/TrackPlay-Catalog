import { type Game, type GameFilters, GameSchema } from '@trackplay/catalog-domain'
import { type Id, type Logger } from '@trackplay/core'
import { type IGDBFetch } from '../helpers/http/igdb.http.ts'
import { createProviderMapper } from '../helpers/mappers/provider.mapper.ts'
import { type BuildIGDBQuery } from '../helpers/query/igdb.query.ts'
import { ROUTES } from '#constants/routes.constant'
import { IGDB } from '#igdbConstants/igdb.constant'
import { IGDBGameListSchema } from '#igdbSchemas/game.schema'
import { type IGDBGame } from '#igdbTypes/game.type'
import { type GameProviderPort } from '#ports/game.port'

const endpoint = ROUTES.IGDB.GAMES
const fields = IGDB.GAMES.FIELDS

const mapper = createProviderMapper<IGDBGame, Game>(GameSchema)

export const igdbGameAdapter = (fetch: IGDBFetch, buildQuery: BuildIGDBQuery, logger: Logger): GameProviderPort => {
  const getGames = async (filters: GameFilters): Promise<Game[]> => {
    const query = buildQuery(fields, filters)

    const games = await fetch({
      endpoint,
      query,
      schema: IGDBGameListSchema,
    })

    return mapper.toDomainList(games, logger)
  }

  const getGameById = async (id: Id): Promise<Game | null> => {
    const query = buildQuery(fields, { where: `id = ${id}` })

    const [game] = await fetch({
      endpoint,
      query,
      schema: IGDBGameListSchema,
    })

    return game ? mapper.toDomain(game) : null
  }

  return {
    getGames,
    getGameById,
  }
}
