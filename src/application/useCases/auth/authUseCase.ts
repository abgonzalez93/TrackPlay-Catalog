import { ProviderToken } from '@trackplay/core/schemas'
import { AuthUseCase } from './authUseCase.interface'
import { TokenService } from '@services/index'

/**
 * **Authentication Use Case**
 *
 * Application-level orchestrator responsible for managing authentication flow
 * with external game providers.
 *
 * This layer defines **what** authentication operations are available to the
 * application — specifically, acquiring a valid access token — while delegating
 * the **how** to the injected {@link TokenService}. It ensures that consumers
 * always receive a valid {@link ProviderToken}, whether from cache or by fetching
 * a new one when necessary.
 *
 * ### Responsibilities
 * - Defines available authentication actions at the application level.
 * - Delegates token issuance and caching to the {@link TokenService}.
 * - Ensures consistent token validity across all provider interactions.
 *
 * @param tokenService - The domain service responsible for token retrieval and caching.
 * @returns An implementation of the {@link AuthUseCase} interface exposing authentication operations.
 */
export const authUseCase = (tokenService: TokenService): AuthUseCase => {
  /**
   * Retrieves a valid access token for the active game provider.
   *
   * If a cached token is still valid, it will be reused.
   * Otherwise, a fresh token will be requested from the provider.
   *
   * @returns A {@link ProviderToken} representing the current valid access token.
   *
   * @throws {Error} If token retrieval or refresh fails.
   */
  const getAccessToken = async (): Promise<ProviderToken> => await tokenService.getValidToken()

  return {
    getAccessToken,
  }
}
