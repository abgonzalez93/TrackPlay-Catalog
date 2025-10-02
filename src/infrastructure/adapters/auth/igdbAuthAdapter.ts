import { apiFetch, validateSchema, getTranslationPath } from '@trackplay/core/utils'
import { TrackPlayError, UnauthorizedError } from '@trackplay/core/errors'
import { ProviderToken } from '@trackplay/core/schemas'
import { toIGDBProviderToken } from '@mappers/index'
import { IGDBTokenSchema } from '@schemas/index'
import { ProviderTokenPort } from '@trackplay/core/ports'

const path = getTranslationPath(import.meta.url)

/**
 * **IGDB Auth Adapter**
 *
 * Infrastructure-level adapter that implements the {@link ProviderTokenPort} interface
 * for the **IGDB/Twitch OAuth 2.0 Client Credentials Flow**.
 *
 * This adapter is responsible for exchanging the `clientId` and `clientSecret`
 * credentials for a short-lived access token via Twitch’s OAuth API. It then
 * validates and maps the response into a domain-neutral {@link ProviderToken}.
 *
 * ### Responsibilities
 * - Perform authentication exclusively for the `igdb` provider.
 * - Exchange client credentials for a bearer token via the Twitch OAuth endpoint.
 * - Validate the raw API response using {@link IGDBTokenSchema}.
 * - Transform the validated payload into a normalized {@link ProviderToken} using {@link toIGDBProviderToken}.
 * - Standardize error handling via {@link UnauthorizedError} and {@link TrackPlayError}.
 *
 * ### Notes
 * - IGDB/Twitch tokens are **short-lived** and must be refreshed periodically.
 * - This adapter **does not** manage caching or persistence — that logic is handled by the {@link TokenService}.
 * - Should be instantiated through a dependency container with valid configuration values.
 *
 * @param clientId - The IGDB/Twitch client identifier.
 * @param clientSecret - The IGDB/Twitch client secret.
 * @param tokenUrl - The Twitch OAuth token endpoint URL.
 * @returns An {@link ProviderTokenPort} implementation specialized for IGDB/Twitch authentication.
 */
export const igdbAuthAdapter = (clientId: string, clientSecret: string, tokenUrl: string): ProviderTokenPort => {
  /**
   * Requests a new OAuth bearer token from the Twitch OAuth API.
   *
   * The method performs a POST request to the configured `tokenUrl` using the
   * **client credentials grant**, validates the response format, and maps it
   * to a domain-neutral {@link ProviderToken}.
   *
   * @returns A normalized {@link ProviderToken} containing the access token and its expiration time.
   *
   * @throws {UnauthorizedError} If authentication fails or the provider response is invalid.
   * @throws {TrackPlayError} If schema validation or another application-level error occurs.
   */
  const requestToken = async (): Promise<ProviderToken> => {
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
  }

  return {
    requestToken,
  }
}
