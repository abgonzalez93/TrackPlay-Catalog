import { BadRequestError, TrackPlayError } from '@trackplay/core/errors'
import { ProviderToken } from '@trackplay/core/schemas'
import { apiFetch } from '@trackplay/core/utils'
import { ProviderTokenPort } from '@trackplay/core/ports'

/**
 * **Execute Query Options**
 *
 * Defines the parameters required to perform a low-level network request
 * against a configured external game provider.
 *
 * This configuration structure allows both query-based (IGDB) and
 * REST-style (RAWG) requests by specifying endpoints, query payloads,
 * and optional authentication metadata.
 *
 * @see {@link fetchFromProvider}
 * @see {@link sendProviderRequest}
 */
interface ExecuteQueryOptions {
  apiUrl: string
  endpoint: string
  query: string
  errorPath: string
  clientId?: string
  method?: 'GET' | 'POST'
}

/**
 * **Build Provider Headers**
 *
 * Constructs a consistent set of HTTP headers for provider communication.
 *
 * ### Responsibilities
 * - Add a default `Content-Type: text/plain` header.
 * - Inject the `Client-ID` header when required (e.g., for IGDB).
 * - Format the `Authorization` header depending on the {@link ProviderToken} type:
 *   - `bearer` → `Authorization: Bearer <token>`
 *   - `apiKey` → `Authorization: <token>`
 *
 * ### Notes
 * - This helper is **provider-agnostic** and may be reused across adapters.
 *
 * @param providerToken - The authentication token obtained via {@link ProviderTokenPort}.
 * @param clientId - Optional client identifier for providers like IGDB.
 * @returns A record of ready-to-use HTTP headers for request execution.
 */
const buildProviderHeaders = (providerToken: ProviderToken, clientId?: string): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'text/plain' }

  if (clientId) headers['Client-ID'] = clientId
  if (providerToken.type === 'bearer') headers['Authorization'] = `Bearer ${providerToken.token}`
  if (providerToken.type === 'apiKey') headers['Authorization'] = providerToken.token

  return headers
}

/**
 * **Send Provider Request**
 *
 * Executes a low-level HTTP request against a configured provider.
 * This function performs the actual network call once a valid
 * {@link ProviderToken} has been obtained.
 *
 * ### Responsibilities
 * - Send authenticated requests using either `POST` (for query-based APIs like IGDB)
 *   or `GET` (for REST-based APIs like RAWG).
 * - Build standardized headers through {@link buildProviderHeaders}.
 * - Return raw, unvalidated provider data to be processed by higher layers.
 * - Normalize and wrap low-level network or provider errors.
 *
 * ### Notes
 * - This is a **low-level helper** and is not intended to be called directly.
 *   Use {@link fetchFromProvider} for token management and orchestration.
 * - Schema validation should be handled by adapters or use cases.
 *
 * @param providerToken - The token used to authenticate the request.
 * @param options - The execution parameters defined in {@link ExecuteQueryOptions}.
 * @returns A promise resolving to the raw, unvalidated provider response.
 *
 * @throws {BadRequestError} If the HTTP request fails or uses an unsupported method.
 * @throws {TrackPlayError} If the provider returns a structured application error.
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
    throw new BadRequestError({ key: `${errorPath}.fetch_failed`, variables: { endpoint } }, error)
  }
}

/**
 * **Fetch From Provider**
 *
 * High-level utility for executing **authenticated** queries
 * against external game providers.
 *
 * This function defines **how** adapters perform authenticated
 * requests in a provider-agnostic manner, unifying IGDB (query-based)
 * and RAWG (REST-based) communication patterns.
 *
 * ### Responsibilities
 * - Request a valid {@link ProviderToken} via the injected {@link ProviderTokenPort}.
 * - Delegate the actual HTTP execution to {@link sendProviderRequest}.
 * - Expose a single, provider-agnostic interface for adapter-level requests.
 *
 * ### Notes
 * - This is the **preferred entry point** for infrastructure adapters.
 * - Adapters should focus on validation and mapping, delegating
 *   authentication and network concerns to this helper.
 *
 * @param authPort - Implementation of {@link ProviderTokenPort} used to obtain provider tokens.
 * @param options - Configuration object defining endpoint, query, and HTTP method.
 * @returns A promise resolving to the raw provider response (unvalidated).
 *
 * @throws {BadRequestError} If network issues occur or provider response is malformed.
 * @throws {TrackPlayError} If the provider explicitly returns an error structure.
 *
 * @see {@link sendProviderRequest}
 * @see {@link ProviderTokenPort}
 * @see {@link ProviderToken}
 */
export const fetchFromProvider = async (authPort: ProviderTokenPort, options: ExecuteQueryOptions): Promise<unknown> => {
  const providerToken = await authPort.requestToken()
  return await sendProviderRequest(providerToken, options)
}
