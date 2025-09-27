import { ProviderToken } from '@trackplay/core/schemas'

/**
 * Interface for the Authentication Use Case.
 *
 * Defines the contract for application-level authentication operations,
 * ensuring that the application can always obtain a valid provider token.
 */
export interface AuthUseCase {
  /**
   * Retrieves a valid provider token for the current game provider.
   *
   * - Reuses a cached token if it is still valid.
   * - Requests a new token if none exists or if the cached token has expired.
   *
   * @returns A valid {@link ProviderToken} object.
   */
  getAccessToken(): Promise<ProviderToken>
}
