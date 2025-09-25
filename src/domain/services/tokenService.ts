import { ProviderToken } from '@trackplay/core/schemas'
import { AuthPort } from '@trackplay/core/ports'

let cachedToken: ProviderToken | null = null
let tokenExpiresAt: number | null = null

/**
 * Token Service
 *
 * Provides an **in-memory caching layer** for authentication tokens retrieved
 * via the {@link AuthPort}. This avoids unnecessary token requests on every call,
 * while ensuring that consumers always receive a valid, non-expired token.
 *
 * Responsibilities:
 * - Requests new tokens from the configured provider using the {@link AuthPort}.
 * - Caches the token locally in memory until it expires.
 * - Reuses cached tokens if they are still valid.
 *
 * Notes:
 * - Expiration is determined by the `expiresAt` property of bearer tokens.
 * - Non-bearer tokens (e.g. API keys) are treated as non-expiring.
 * - This service only manages tokens; it does not map or normalize provider data
 *   beyond what is exposed by {@link ProviderToken}.
 */
export const tokenService = (authPort: AuthPort) => ({
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

    const token = await authPort.requestToken()
    cachedToken = token

    if (token.type === 'bearer' && token.expiresAt) {
      tokenExpiresAt = token.expiresAt
    } else {
      tokenExpiresAt = null
    }

    return token
  },
})
