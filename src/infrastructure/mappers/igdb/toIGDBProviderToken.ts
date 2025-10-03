import { ProviderToken } from '@trackplay/core/schemas'
import { IGDBToken } from '@schemas/index'

/**
 * **toIGDBProviderToken**
 *
 * Maps a provider-specific {@link IGDBToken} obtained from IGDB’s OAuth2 API
 * into a standardized {@link ProviderToken} format used within the application.
 *
 * ### Scope
 * - Acts as a translation layer between the IGDB/Twitch authentication response
 *   and the domain-level token model.
 * - Ensures consistent token structure across all providers.
 *
 * ### Mapping
 * - `access_token` → `token`
 * - `expires_in` → `expiresAt` (converted to absolute timestamp in milliseconds)
 * - `token_type` (implicit) → `type = "bearer"`
 *
 * ### Notes
 * - IGDB tokens follow the **OAuth 2.0 Client Credentials Flow**.
 * - The resulting {@link ProviderToken} is always of type `"bearer"`.
 * - Expiration time is computed relative to the current timestamp.
 *
 * @param entity - Raw token response returned by IGDB/Twitch.
 * @returns A normalized {@link ProviderToken} ready for domain use.
 *
 * @see {@link IGDBToken}
 * @see {@link igdbAuthAdapter}
 */
export const toIGDBProviderToken = (entity: IGDBToken): ProviderToken => {
  return {
    token: entity.access_token,
    expiresAt: Date.now() + entity.expires_in * 1000,
    type: 'bearer',
  }
}
