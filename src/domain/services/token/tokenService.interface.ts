import { ProviderToken } from '@trackplay/core/schemas'

/**
 * **TokenService (interface)**
 *
 * Application-layer contract defining **how authentication tokens are obtained**
 * for the active external provider.
 *
 * ### Scope
 * - Declares the operation for retrieving a valid {@link ProviderToken}.
 * - Abstracts away provider-specific and caching details from higher layers.
 *
 * ### Semantics
 * - Must always return a valid token at the time of resolution.
 * - Implementations may apply strategies such as caching or renewal internally.
 */
export interface TokenService {
  /**
   * Retrieves a valid {@link ProviderToken} for the current provider.
   *
   * @returns A promise resolving to a valid {@link ProviderToken}.
   * @remarks The strategy used to obtain or refresh the token is determined
   *          by the concrete implementation.
   */
  getValidToken(): Promise<ProviderToken>
}
