import { BadRequestError, TrackPlayError } from '@trackplay/core/errors'
import { ProviderToken } from '@trackplay/core/schemas'
import { apiFetch } from '@trackplay/core/utils'
import { AuthPort } from '@trackplay/core/ports'

/**
 * Options for executing a query against an external game provider.
 *
 * Defines the parameters required to perform a network request, including
 * provider-specific identifiers and optional HTTP method overrides.
 */
export interface ExecuteQueryOptions {
  apiUrl: string
  endpoint: string
  query: string
  errorPath: string
  clientId?: string
  method?: 'GET' | 'POST'
}

/**
 * Builds HTTP headers required for provider communication.
 *
 * Responsibilities:
 * - Sets a default `Content-Type` header (`text/plain`).
 * - Injects `Client-ID` when required (e.g., for IGDB).
 * - Applies the correct `Authorization` format depending on the {@link ProviderToken} type:
 *   - `bearer` → `Authorization: Bearer <token>`
 *   - `apiKey` → `Authorization: <token>`
 *
 * Notes:
 * - This helper is **provider-agnostic** and may be reused across adapters.
 *
 * @param providerToken - Authentication token obtained via {@link AuthPort}.
 * @param clientId - Optional client identifier required by certain providers.
 * @returns Record of HTTP headers ready for request execution.
 */
const buildProviderHeaders = (providerToken: ProviderToken, clientId?: string): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'text/plain' }

  if (clientId) headers['Client-ID'] = clientId
  if (providerToken.type === 'bearer') headers['Authorization'] = `Bearer ${providerToken.token}`
  if (providerToken.type === 'apiKey') headers['Authorization'] = providerToken.token

  return headers
}

/**
 * Executes a low-level HTTP request against a configured provider.
 *
 * Responsibilities:
 * - Sends authenticated requests using either `POST` (for query-based APIs like IGDB)
 *   or `GET` (for RESTful APIs like RAWG).
 * - Builds consistent headers through {@link buildProviderHeaders}.
 * - Returns unvalidated raw data, delegating schema validation to adapters.
 * - Wraps and normalizes low-level network or provider errors into
 *   domain-level {@link BadRequestError} or {@link TrackPlayError}.
 *
 * Notes:
 * - This function assumes a valid {@link ProviderToken} has been obtained.
 * - For higher-level usage, prefer {@link executeQuery}, which handles token acquisition.
 *
 * @param providerToken - Authentication token used for the request.
 * @param options - Query execution parameters defined in {@link ExecuteQueryOptions}.
 * @returns Promise resolving to the raw, unvalidated provider response.
 *
 * @throws {BadRequestError} - Thrown on network or unexpected response issues.
 * @throws {TrackPlayError} - Thrown if the provider response matches a known error structure.
 */
const sendProviderRequest = async (providerToken: ProviderToken, options: ExecuteQueryOptions): Promise<unknown> => {
  const { apiUrl, endpoint, query, errorPath, clientId, method = 'POST' } = options

  try {
    const headers = buildProviderHeaders(providerToken, clientId)
    const url = `${apiUrl}/${endpoint}`

    if (method === 'POST') {
      return await apiFetch.post<unknown>(url, { body: query, headers })
    }

    if (method === 'GET') {
      const fullUrl = query ? `${url}?${query}` : url
      return await apiFetch.get<unknown>(fullUrl, { headers })
    }

    throw new BadRequestError(`${errorPath}.unsupported_method`, { method })
  } catch (error: unknown) {
    if (error instanceof TrackPlayError) throw error
    throw new BadRequestError(`${errorPath}.fetch_failed`, error)
  }
}

/**
 * Executes an **authenticated** query against a game provider.
 *
 * Responsibilities:
 * - Requests a valid {@link ProviderToken} from the given {@link AuthPort}.
 * - Delegates request execution to {@link execute}.
 * - Unifies access patterns for both query-based (IGDB) and REST-based (RAWG) providers.
 *
 * Notes:
 * - This is the **preferred entry point** for adapters making external API calls.
 * - Adapters should remain focused on validation and mapping, leaving
 *   authentication and network details to this utility.
 *
 * @param authPort - Implementation of {@link AuthPort} used to request provider tokens.
 * @param options - Configuration object defining endpoint, query, and provider parameters.
 * @returns Promise resolving to the raw provider response, ready for validation.
 *
 */
export const fetchFromProvider = async (authPort: AuthPort, options: ExecuteQueryOptions): Promise<unknown> => {
  const providerToken = await authPort.requestToken()
  return await sendProviderRequest(providerToken, options)
}
