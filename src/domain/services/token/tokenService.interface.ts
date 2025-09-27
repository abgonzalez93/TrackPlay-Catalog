import { ProviderToken } from '@trackplay/core/schemas'

/**
 * Interface for the Token Service.
 *
 * Defines the contract for retrieving valid authentication tokens,
 * with built-in support for caching and expiration handling.
 */
export interface TokenService {
  /**
   * Retrieves a valid token for the current provider.
   *
   * - If a cached token exists and is still valid, it will be reused.
   * - Otherwise, a new token will be requested from the provider.
   *
   * @returns A valid {@link ProviderToken} object.
   */
  getValidToken(): Promise<ProviderToken>
}
