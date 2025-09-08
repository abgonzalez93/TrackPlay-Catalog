import { apiFetch } from '@trackplay/core/utils'
import { igdbService } from '@services/index'
import { getEnvConfig } from '@config/index'

const { IGDB_API_URL, IGDB_CLIENT_ID } = getEnvConfig

/**
 * Low-level HTTP client for interacting with the IGDB API.
 *
 * This client is responsible only for:
 * - Attaching the required authentication headers (OAuth token, Client-ID).
 * - Sending queries to specific IGDB endpoints.
 * - Returning the raw response payload without validation.
 *
 * Validation and higher-level business logic should be handled
 * in the corresponding services (e.g., `igdbService`).
 */
export const igdbClient = {
  /**
   * Sends a POST request to a given IGDB API endpoint with a query string body.
   *
   * @template T - Expected response type (usually a parsed JSON array of IGDB entities).
   * @param endpoint - The IGDB API endpoint (e.g., `"games"`, `"platforms"`).
   * @param query - The IGDB query string, built with `buildIGDBQuery`.
   * @returns The raw response data parsed as type `T`.
   */
  request: async <T>(endpoint: string, query: string): Promise<T> => {
    const accessToken = await igdbService.getAccessToken()
    return await apiFetch.post<T>(`${IGDB_API_URL}/${endpoint}`, {
      body: query,
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'text/plain',
      },
    })
  },
}
