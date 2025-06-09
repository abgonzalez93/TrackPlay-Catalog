import { apiFetch } from '@trackplay/core/utils'
import { getEnvConfig } from '@config/index'

const { IGDB_API_URL, IGDB_CLIENT_ID } = getEnvConfig

/**
 * Sends a POST request to the IGDB API using the given query and token.
 *
 * @param query - IGDB query string in plain text format
 * @param token - OAuth bearer token for IGDB authentication
 * @returns Axios response containing raw IGDB data
 * @throws AxiosError if the request fails
 * @private
 */
export const postToIGDB = async <T>(query: string, token: string): Promise<T> => {
  return await apiFetch.post<T>(`${IGDB_API_URL}/games`, {
    body: query,
    headers: {
      'Client-ID': IGDB_CLIENT_ID,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
  })
}
