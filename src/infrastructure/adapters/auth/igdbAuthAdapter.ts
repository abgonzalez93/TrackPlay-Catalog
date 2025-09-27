import { TrackPlayError, UnauthorizedError } from '@trackplay/core/errors'
import { apiFetch, validateSchema } from '@trackplay/core/utils'
import { ProviderToken } from '@trackplay/core/schemas'
import { toIGDBProviderToken } from '@mappers/index'
import { IGDBTokenSchema } from '@schemas/index'
import { AuthPort } from '@trackplay/core/ports'

const path = 'catalog.infrastructure.adapters.igdbAuthAdapter'

/**
 * IGDB Auth Adapter
 *
 * This adapter provides the {@link AuthPort} implementation for IGDB/Twitch,
 * using the **OAuth 2.0 Client Credentials Flow**. It requests, validates,
 * and maps access tokens into a domain-neutral {@link ProviderToken}.
 *
 * Responsibilities
 * - Perform authentication exclusively for the `igdb` provider.
 * - Exchange `clientId` and `clientSecret` for an access token via Twitch's OAuth API.
 * - Validate the raw token response using {@link IGDBTokenSchema}.
 * - Map the validated response into a neutral {@link ProviderToken} via {@link toIGDBProviderToken}.
 * - Normalize errors by throwing {@link UnauthorizedError} or rethrowing known {@link TrackPlayError}.
 *
 * Notes
 * - Tokens issued by IGDB/Twitch are **short-lived** and must be refreshed regularly.
 * - This adapter does **not** handle token caching or persistence (delegated to TokenService).
 * - Should only be instantiated through the container with proper configuration values.
 *
 * @param clientId - The IGDB/Twitch client identifier.
 * @param clientSecret - The IGDB/Twitch client secret.
 * @param tokenUrl - The OAuth token endpoint URL.
 * @returns An {@link AuthPort} implementation for IGDB/Twitch authentication.
 *
 */
export const igdbAuthAdapter = (clientId: string, clientSecret: string, tokenUrl: string): AuthPort => ({
  /**
   * Requests a new OAuth bearer token from IGDB/Twitch.
   *
   * @throws {UnauthorizedError} If the response is invalid or authentication fails.
   * @throws {TrackPlayError} If schema validation or other application-level error occurs.
   * @returns A normalized {@link ProviderToken} containing the access token and expiration time.
   */
  requestToken: async (): Promise<ProviderToken> => {
    try {
      const raw = await apiFetch.post<unknown>(tokenUrl, {
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials',
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      const token = validateSchema(IGDBTokenSchema, raw, `${path}.invalid_format`)
      return toIGDBProviderToken(token)
    } catch (error: unknown) {
      if (error instanceof TrackPlayError) throw error
      throw new UnauthorizedError(`${path}.auth_failed`, error)
    }
  },
})
