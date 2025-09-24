import { Id, Game, GameList, GameFilters } from '@trackplay/core/schemas'
import { IGDBGameListSchema, IGDBGameSchema } from '@schemas/index'
import { toGame, toIGDBFilters } from '@mappers/index'
import { validateSchema } from '@trackplay/core/utils'
import { GamePort } from '@trackplay/core/ports'
import { buildIGDBQuery } from '@queries/index'
import { executeQuery } from '@utils/index'

const path = 'catalog.infrastructure.adapters.gameAdapter'
const endpoint = 'games'

/**
 * Game Adapter
 *
 * Infrastructure-level adapter that implements the {@link GamePort}.
 *
 * Responsibilities:
 * - Transforms domain-neutral {@link GameFilters} into IGDB-specific filters.
 * - Builds and executes IGDB queries using {@link executeQuery}.
 * - Validates raw provider responses against Zod schemas
 *   ({@link IGDBGameListSchema}, {@link IGDBGameSchema}).
 * - Maps IGDB entities into neutral {@link Game} domain objects.
 *
 * Notes:
 * - Returns `null` in {@link getGameById} if no game is found.
 * - This adapter is provider-aware (IGDB-specific) but exposes only
 *   domain-neutral types back to the application layer.
 */
export const gameAdapter: GamePort = {
  /**
   * Searches for games using domain-neutral {@link GameFilters}.
   *
   * @param filters - Filtering and sorting options defined at the domain level.
   * @returns {Promise<GameList>} A list of validated and mapped {@link Game} entities.
   */
  searchGames: async (filters: GameFilters): Promise<GameList> => {
    const igdbFilters = toIGDBFilters(filters)
    const query = buildIGDBQuery(igdbFilters)
    const raw = await executeQuery(endpoint, query, path)
    const games = validateSchema(IGDBGameListSchema, raw, `${path}.invalid_format`)
    return games.map(toGame)
  },

  /**
   * Retrieves a single game by its domain-level {@link Id}.
   *
   * @param id - The unique identifier of the game in the domain.
   * @returns {Promise<Game | null>} A mapped {@link Game} entity,
   * or `null` if no game exists with the given ID.
   */
  getGameById: async (id: Id): Promise<Game | null> => {
    const query = buildIGDBQuery({ where: `id = ${id}` })
    const raw = await executeQuery(endpoint, query, path)
    const game = validateSchema(IGDBGameSchema, raw, `${path}.invalid_format`)
    return game ? toGame(game) : null
  },
}
