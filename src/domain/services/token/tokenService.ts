import { ProviderToken } from '@trackplay/core/schemas'
import { TokenService } from './tokenService.interface'
import { AuthPort } from '@trackplay/core/ports'

let cachedToken: ProviderToken | null = null

/**
 * Token Service
 *
 * Provides an in-memory caching layer for authentication tokens obtained
 * via the {@link AuthPort}. This mechanism minimizes redundant provider
 * requests and ensures valid tokens are reused efficiently.
 *
 * ## Responsibilities
 * - Requests new tokens from the configured provider when required.
 * - Caches the most recent token in memory for reuse.
 * - Validates bearer token expiration before reusing cached tokens.
 * - Handles non-expiring tokens (e.g., API keys) transparently.
 *
 * ## Notes
 * - Bearer tokens are considered valid until their `expiresAt` timestamp.
 * - API keys are treated as non-expiring and never refreshed.
 * - This service does **not** persist tokens — all state is in-memory only.
 */
export const tokenService = (authPort: AuthPort): TokenService => ({
  /**
   * Retrieves a valid authentication token.
   *
   * Reuses a cached token if:
   * - The token is of type `apiKey`, or
   * - The token is of type `bearer` and has not expired.
   *
   * Otherwise, requests a fresh token from the provider and caches it.
   *
   * @returns A valid {@link ProviderToken} for the current provider.
   */
  getValidToken: async (): Promise<ProviderToken> => {
    const isApiKey = cachedToken?.type === 'apiKey'
    const isBearerValid = cachedToken?.type === 'bearer' && Date.now() < cachedToken.expiresAt

    if (!cachedToken || (!isApiKey && !isBearerValid)) cachedToken = await authPort.requestToken()
    return cachedToken
  },
})
