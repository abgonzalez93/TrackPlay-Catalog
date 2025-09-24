import { BadRequestError, TrackPlayError } from '@trackplay/core/errors'
import { currentProviderConfig } from '@config/index'
import { apiFetch } from '@trackplay/core/utils'
import { authUseCase } from '@useCases/index'

/**
 * Executes a raw query against the currently configured game provider.
 *
 * Responsibilities:
 * - Builds and sends an authenticated HTTP POST request with the required headers,
 *   adapting to the provider's authentication mechanism (`Bearer` + `Client-ID` or API key).
 * - Delegates token retrieval to {@link authUseCase}.
 * - Returns the raw provider response as `unknown`, leaving validation
 *   to the calling adapter.
 * - Normalizes network or provider errors into domain-specific errors.
 *
 * @param endpoint - The provider resource path (e.g., `"games"`, `"genres"`, `"platforms"`).
 * @param query - The query string written in the provider's query language.
 * @param errorPath - Namespace or prefix used for consistent error codes/messages.
 *
 * @returns {Promise<unknown>} A promise resolving to the raw, unvalidated
 * response returned by the provider.
 *
 * @throws {BadRequestError}
 * Thrown when the request fails due to network issues or unexpected response format.
 *
 * @throws {TrackPlayError}
 * Re-thrown if the provider returns a recognized domain-level error upstream.
 */
export const executeQuery = async (endpoint: string, query: string, errorPath: string): Promise<unknown> => {
  try {
    const { token, type } = await authUseCase.getAccessToken()

    const headers: Record<string, string> = {
      'Content-Type': 'text/plain',
    }

    if (currentProviderConfig.type === 'igdb' && 'clientId' in currentProviderConfig) {
      headers['Client-ID'] = currentProviderConfig.clientId
    }

    if (type === 'bearer') {
      headers['Authorization'] = `Bearer ${token}`
    } else if (type === 'apiKey') {
      headers['Authorization'] = token
    }

    return await apiFetch.post<unknown>(`${currentProviderConfig.apiUrl}/${endpoint}`, {
      body: query,
      headers,
    })
  } catch (error: unknown) {
    if (error instanceof TrackPlayError) throw error
    throw new BadRequestError(`${errorPath}.fetch_failed`, error)
  }
}
