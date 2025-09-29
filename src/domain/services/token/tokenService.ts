import { ProviderToken } from '@trackplay/core/schemas'
import { TokenService } from './tokenService.interface'
import { AuthPort } from '@trackplay/core/ports'

let cachedToken: ProviderToken | null = null
let tokenExpiresAt: number | null = null

/**
 * Token Service
 *
 * Provides an in-memory caching mechanism for authentication tokens
 * obtained through the {@link AuthPort}. This ensures efficient token
 * management and avoids redundant provider calls.
 *
 * Responsibilities:
 * - Requests tokens from the configured provider.
 * - Stores tokens in memory until expiration.
 * - Validates cached tokens before reusing them.
 *
 * Notes:
 * - Expiration is respected for bearer tokens via their `expiresAt` field.
 * - Non-bearer tokens (e.g., API keys) are treated as non-expiring.
 * - This service does not handle persistence beyond in-memory storage.
 */
export const tokenService = (authPort: AuthPort): TokenService => ({
  /**
   * Retrieves a valid token for the current provider.
   * Reuses cached tokens if valid; otherwise, fetches a new one.
   */
  getValidToken: async (): Promise<ProviderToken> => {
    if (cachedToken && cachedToken.type === 'apiKey') return cachedToken
    if (Date.now() < cachedToken.expiresAt) return cachedToken

    const token = await authPort.requestToken()
    cachedToken = token
    tokenExpiresAt = token.type === 'bearer' ? token.expiresAt : null

    return token
  },
})
