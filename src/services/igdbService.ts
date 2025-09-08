import { IGDBGameSchema, IGDBGame, IGDBGameFilters, IGDBTokenSchema, IGDBToken } from '@trackplay/core/schemas'
import { BadRequestError, NotFoundError, TrackPlayError, UnauthorizedError } from '@trackplay/core/errors'
import { buildIGDBQuery, BuildQueryOptions } from '@utils/index'
import { apiFetch, parseOrThrow } from '@trackplay/core/utils'
import { getEnvConfig } from '@config/index'
import { igdbClient } from '@clients/index'

let accessToken: string | null = null
let tokenExpiresAt: number | null = null

const { IGDB_TOKEN_URL, IGDB_CLIENT_ID, IGDB_CLIENT_SECRET } = getEnvConfig

const path = 'igdb.services.igdbService'

/**
 * Service for authenticating and retrieving game data from IGDB.
 */
export const igdbService = {
  /**
   * Retrieves and caches a valid OAuth token from the Twitch/IGDB API.
   * If a cached token is still valid, it is reused.
   *
   * @returns A valid bearer token for IGDB requests
   * @throws UnauthorizedError if the token cannot be obtained
   */
  getAccessToken: async (): Promise<string> => {
    const now = Date.now()

    if (accessToken && tokenExpiresAt && now < tokenExpiresAt) return accessToken

    const params = new URLSearchParams({
      client_id: IGDB_CLIENT_ID,
      client_secret: IGDB_CLIENT_SECRET,
      grant_type: 'client_credentials',
    })

    try {
      const data = await apiFetch.post<IGDBToken>(IGDB_TOKEN_URL, {
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const token = parseOrThrow(IGDBTokenSchema, data, `${path}.token_invalid_format`)

      accessToken = token.access_token
      tokenExpiresAt = now + data.expires_in * 1000

      return accessToken
    } catch (error: unknown) {
      if (error instanceof TrackPlayError) throw error
      throw new UnauthorizedError(`${path}.auth_failed`, error)
    }
  },

  fetchGames: async (filters: BuildQueryOptions): Promise<IGDBGame[]> => {
    try {
      const query = buildIGDBQuery(filters)
      const games = await igdbClient.request<IGDBGame[]>('games', query)
      const parsedGames = parseOrThrow(IGDBGameSchema.array(), games, `${path}.games_invalid_format`)
      return parsedGames
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
   * @throws BadRequestError - If the API request fails or the response is invalid.
   */
  searchGames: async (filters: IGDBGameFilters): Promise<IGDBGame[]> => await igdbService.fetchGames(filters),

  /**
   * Fetches and validates a single game by its IGDB numeric ID.
   *
   * Builds a query using `buildIGDBQuery` with a custom `where` clause to
   * request a single game. Validates the response structure using Zod.
   *
   * @param igdbId - The numeric IGDB ID of the game to retrieve.
   * @returns A validated `IGDBGame` object.
   * @throws BadRequestError - If the game is not found or the response is invalid.
   */
  getGameById: async (igdbId: number): Promise<IGDBGame> => {
    const [game] = await igdbService.fetchGames({ where: `id = ${igdbId}` })
    if (!game) throw new NotFoundError(`${path}.game_not_found`)
    return parseOrThrow(IGDBGameSchema, game, `${path}.game_invalid_format`)
  },
}
