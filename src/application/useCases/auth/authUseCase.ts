import { ProviderToken } from '@trackplay/core/schemas'
import { AuthUseCase } from './authUseCase.interface'
import { TokenService } from '@services/index'

/**
 * Authentication Use Case
 *
 * Provides application-level access to authentication operations.
 * This layer ensures that the application always has a valid provider
 * token available, regardless of whether it is cached or needs to be
 * freshly requested.
 *
 * Responsibilities:
 * - Defines **what** the application can do regarding authentication.
 * - Delegates token management logic to the {@link TokenService}.
 * - Guarantees that consumers receive a valid {@link ProviderToken}.
 *
 */
export const authUseCase = (tokenService: TokenService): AuthUseCase => {
  /**
   * Retrieves a valid provider token for the current game provider.
   * Reuses cached tokens if valid, otherwise fetches a new one.
   */
  const getAccessToken = async (): Promise<ProviderToken> => {
    return await tokenService.getValidToken()
  }

  return {
    getAccessToken,
  }
}
