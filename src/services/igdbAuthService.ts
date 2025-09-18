import { TrackPlayError, UnauthorizedError } from '@trackplay/core/errors'
import { apiFetch, validateSchema } from '@trackplay/core/utils'
import { IGDBTokenSchema } from '@schemas/index'
import { getEnvConfig } from '@config/index'

const { IGDB_TOKEN_URL, IGDB_CLIENT_ID, IGDB_CLIENT_SECRET } = getEnvConfig

let accessToken: string | null = null
let tokenExpiresAt: number | null = null

const path = 'igdb.services.igdbAuthService'

/**
 * IGDB Authentication Service.
 *
 * Handles OAuth token retrieval and caching for the Twitch/IGDB API.
 * Ensures that a valid bearer token is always available for IGDB requests,
 * automatically reusing it until expiration.
 */
export const igdbAuthService = {
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
      const data = await apiFetch.post<unknown>(IGDB_TOKEN_URL, {
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      const token = validateSchema(IGDBTokenSchema, data, `${path}.token_invalid_format`)

      accessToken = token.access_token
      tokenExpiresAt = now + token.expires_in * 1000

      return accessToken
    } catch (error: unknown) {
      if (error instanceof TrackPlayError) throw error
      throw new UnauthorizedError(`${path}.auth_failed`, error)
    }
  },
}
