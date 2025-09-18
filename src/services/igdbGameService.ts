import { BadRequestError, NotFoundError, TrackPlayError } from '@trackplay/core/errors'
import { IGDBGame, IGDBGameFilters, IGDBGameListSchema, IGDBId } from '@schemas/index'
import { buildIGDBQuery, BuildQueryOptions } from '@utils/index'
import { validateSchema } from '@trackplay/core/utils'
import { igdbClient } from '@clients/index'

const path = 'igdb.services.igdbGameService'

/**
 * IGDB Game Service.
 *
 * Provides high-level operations for interacting with the IGDB `games` endpoint.
 * Includes generic queries, search with filters, and lookup by numeric ID.
 */
export const igdbGameService = {
  /**
   * Executes a generic query against the IGDB `games` endpoint.
   *
   * Internally calls {@link buildIGDBQuery} to generate a valid IGDB query string
   * from the provided filters, then performs the request using {@link igdbClient}.
   *
   * @param filters - Query options such as search term, rating filters, platforms, etc.
   * @returns A list of {@link IGDBGame} objects returned by IGDB.
   * @throws TrackPlayError - If a domain-level error occurs upstream.
   * @throws BadRequestError - If the request fails or the response cannot be parsed.
   */
  queryGames: async (filters: BuildQueryOptions): Promise<IGDBGame[]> => {
    try {
      const query = buildIGDBQuery(filters)
      const data = await igdbClient.request<unknown>('games', query)
      return validateSchema(IGDBGameListSchema, data, `${path}.games_invalid_format`)
    } catch (error: unknown) {
      if (error instanceof TrackPlayError) throw error
      throw new BadRequestError(`${path}.games_fetch_failed`, error)
    }
  },

  /**
   * Executes a search query against the IGDB API using filter options,
   * and returns a validated list of games.
   *
   * Internally builds a query string using the `buildIGDBQuery` utility based on
   * the provided filters (search term, rating, genres, platforms, etc.).
   *
   * @param filters - Filtering and sorting options to apply to the IGDB API query.
   * @returns A validated array of `IGDBGame` objects.
   */
  searchGames: async (filters: IGDBGameFilters): Promise<IGDBGame[]> => await igdbGameService.queryGames(filters),

  /**
   * Fetches and validates a single game by its IGDB numeric ID.
   *
   * Builds a query using `buildIGDBQuery` with a custom `where` clause to
   * request a single game. Validates the response structure using Zod.
   *
   * @param id - The numeric IGDB ID of the game to retrieve.
   * @returns A validated `IGDBGame` object.
   */
  getGameById: async (id: IGDBId): Promise<IGDBGame> => {
    const [game] = await igdbGameService.queryGames({ where: `id = ${id}` })
    if (!game) throw new NotFoundError(`${path}.game_not_found`)
    return game
  },
}
