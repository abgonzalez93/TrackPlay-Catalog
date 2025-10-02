import { ProviderToken } from '@trackplay/core/schemas'
import { TokenService } from './tokenService.interface'
import { ProviderTokenPort } from '@trackplay/core/ports'

let cachedToken: ProviderToken | null = null

/**
 * **Token Service**
 *
 * Domain-level service responsible for managing authentication tokens
 * obtained via the {@link ProviderTokenPort}. It introduces an in-memory caching
 * mechanism to avoid redundant token requests and ensure efficient reuse.
 *
 * This layer defines **how** tokens are fetched, validated, and cached
 * within the application lifecycle, ensuring that upper layers (use cases,
 * adapters) always operate with a valid {@link ProviderToken}.
 *
 * ### Responsibilities
 * - Requests new tokens from the underlying {@link ProviderTokenPort} when needed.
 * - Maintains a short-lived in-memory cache for quick token reuse.
 * - Validates bearer token expiration before returning cached results.
 * - Transparently handles non-expiring tokens such as API keys.
 *
 * ### Notes
 * - Bearer tokens are valid until their `expiresAt` timestamp.
 * - API keys are treated as non-expiring and never refreshed.
 * - All state is held in memory — this service does **not** persist tokens.
 *
 * @param authPort - The infrastructure port responsible for fetching provider tokens.
 * @returns An implementation of the {@link TokenService} interface exposing token operations.
 */
export const tokenService = (authPort: ProviderTokenPort): TokenService => {
  /**
   * Retrieves a valid authentication token for the current provider.
   *
   * The cached token is reused if:
   * - It is of type `apiKey`, or
   * - It is a `bearer` token that has not yet expired.
   *
   * Otherwise, the service requests a fresh token via the {@link ProviderTokenPort}
   * and updates the in-memory cache.
   *
   * @returns A valid {@link ProviderToken} representing the current provider session.
   *
   * @throws {Error} If token retrieval from the provider fails.
   */
  const getValidToken = async (): Promise<ProviderToken> => {
    const isApiKey = cachedToken?.type === 'apiKey'
    const isBearerValid = cachedToken?.type === 'bearer' && Date.now() < cachedToken.expiresAt

    if (!cachedToken || (!isApiKey && !isBearerValid)) {
      cachedToken = await authPort.requestToken()
    }

    return cachedToken
  }

  return {
    getValidToken,
  }
}
