import { ProviderToken } from '@trackplay/core/schemas'
import { tokenService } from '@services/index'
import { authAdapter } from '@adapters/index'

const tokenServiceInstance = tokenService(authAdapter)

/**
 * Authentication UseCase
 *
 * Provides application-level access to authentication operations.
 * Orchestrates calls to the TokenService to ensure that a valid
 * provider token is always available for use by the application.
 */
export const authUseCase = {
  /**
   * Retrieves a valid provider token for the current game provider.
   *
   * If a cached token is still valid, it will be reused.
   * Otherwise, a new token will be requested and cached until expiration.
   *
   * @returns {Promise<ProviderToken>} A valid provider token object.
   */
  getAccessToken: async (): Promise<ProviderToken> => await tokenServiceInstance.getValidToken(),
}
