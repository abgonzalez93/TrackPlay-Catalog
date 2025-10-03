import { ProviderToken } from '@trackplay/core/schemas'

/**
 * **AuthUseCase (interface)**
 *
 * Application-layer contract for retrieving a valid {@link ProviderToken}.
 * Defines **what** the application can do regarding provider authentication,
 * without prescribing **how** it is achieved.
 *
 * ### Scope
 * - Declares the operation to obtain a valid {@link ProviderToken}.
 * - Does **not** define caching, renewal, or provider interaction strategies.
 *
 * ### Semantics
 * - The returned promise **must** resolve to a valid token at the time of resolution.
 * - Implementations may throw if a valid token cannot be obtained (e.g., invalid credentials).
 */
export interface AuthUseCase {
  /**
   * Retrieves a valid {@link ProviderToken} for the active external provider.
   *
   * @returns A promise that resolves to a valid {@link ProviderToken}.
   * @remarks The underlying strategy (cache usage, renewal, or remote fetch)
   *          is left to the concrete implementation.
   */
  getAccessToken(): Promise<ProviderToken>
}
