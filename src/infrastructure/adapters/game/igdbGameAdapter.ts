import { Id, Game, GameList, GameFilters } from '@trackplay/core/schemas'
import { IGDBGameListSchema, IGDBGameSchema } from '@schemas/index'
import { AuthPort, GamePort } from '@trackplay/core/ports'
import { toGame, toIGDBFilters } from '@mappers/index'
import { fetchAndMapFromIGDB } from '../helpers/index'
import { buildIGDBQuery } from '@queries/index'

const path = 'catalog.infrastructure.adapters.igdb.gameAdapter'
const endpoint = 'games'

/**
 * IGDB Game Adapter
 *
 * Infrastructure-level adapter implementing {@link GamePort} for IGDB.
 *
 * Responsibilities:
 * - Converts domain-level {@link GameFilters} into IGDB query syntax.
 * - Executes authenticated API calls via {@link fetchAndMapFromIGDB}.
 * - Validates responses and maps them into domain-safe {@link Game} entities.
 *
 * Notes:
 * - Uses POST requests with IGDB query language.
 * - Returns `null` if a requested game is not found.
 * - Operates strictly within the infrastructure layer.
 */
export const igdbGameAdapter = (authPort: AuthPort, apiUrl: string, clientId: string): GamePort => ({
  /**
   * Searches for games based on domain-level {@link GameFilters}.
   *
   * Responsibilities:
   * - Converts filters into IGDB query syntax.
   * - Builds query string using {@link buildIGDBQuery}.
   * - Executes provider request via {@link fetchAndMapFromIGDB}.
   * - Validates and maps API responses into domain {@link Game} entities.
   *
   * @param filters - Domain-level filtering and sorting options.
   * @returns Promise resolving to a validated and mapped {@link GameList}.
   */
  searchGames: (filters: GameFilters): Promise<GameList> => {
    const igdbFilters = toIGDBFilters(filters)
    const query = buildIGDBQuery(igdbFilters)

    return fetchAndMapFromIGDB(authPort, {
      apiUrl,
      clientId,
      endpoint,
      query,
      schema: IGDBGameListSchema,
      mapper: (games) => games.map(toGame),
      errorPath: path,
    })
  },

  /**
   * Retrieves a single game by its domain-level {@link Id}.
   *
   * Responsibilities:
   * - Builds an IGDB query targeting the specified ID.
   * - Executes API call via {@link fetchAndMapFromIGDB}.
   * - Validates the result against {@link IGDBGameSchema}.
   * - Maps validated data into a domain {@link Game} entity.
   *
   * @param id - Unique domain identifier of the game.
   * @returns Promise resolving to a mapped {@link Game} or `null` if not found.
   */
  getGameById: async (id: Id): Promise<Game | null> => {
    const query = buildIGDBQuery({ where: `id = ${id}` })

    return await fetchAndMapFromIGDB(authPort, {
      apiUrl,
      clientId,
      endpoint,
      query,
      schema: IGDBGameSchema,
      mapper: (game) => (game ? toGame(game) : null),
      errorPath: path,
    })
  },
})
