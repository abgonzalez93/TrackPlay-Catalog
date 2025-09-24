import { ProviderToken } from '@trackplay/core/schemas'
import { authAdapter } from '@adapters/index'

let cachedToken: ProviderToken | null = null
let tokenExpiresAt: number | null = null

/**
 * Token Service
 *
 * Provides a caching layer for authentication tokens retrieved from the provider.
 * Ensures that a valid token is always available without requesting a new one
 * on every call.
 */
export const tokenService = {
  /**
   * Retrieves a valid token for the current provider.
   *
   * If a cached token exists and has not expired, it will be reused.
   * Otherwise, a new token will be requested and cached until expiration.
   *
   * @returns {Promise<ProviderToken>} A valid provider token object.
   */
  getValidToken: async (): Promise<ProviderToken> => {
    if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) return cachedToken

    const token = await authAdapter.requestToken()
    cachedToken = token

    if (token.type === 'bearer' && token.expiresAt) {
      tokenExpiresAt = token.expiresAt
    } else {
      tokenExpiresAt = null
    }

    return token
  },
}
