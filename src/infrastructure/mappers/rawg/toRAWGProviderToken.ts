import { ProviderToken } from '@trackplay/core/schemas'
import { RAWGToken } from '@schemas/index'

/**
 * **toRAWGProviderToken**
 *
 * Maps a {@link RAWGToken} (containing a static API key)
 * into a domain-neutral {@link ProviderToken} representation.
 *
 * ### Scope
 * - Serves as a translation layer between RAWG’s authentication model
 *   and the standardized {@link ProviderToken} structure.
 * - Ensures consistent token shape across all providers, even for static keys.
 *
 * ### Mapping
 * - `apiKey` → `token`
 * - `expiresAt` → `null` (RAWG API keys do not expire)
 * - `type` → `"apiKey"`
 *
 * ### Notes
 * - RAWG uses a static API key instead of an OAuth flow.
 * - The resulting token is **permanent** and never refreshed.
 * - Enables unified token handling across different provider types (IGDB vs RAWG).
 *
 * @param entity - The RAWG token entity containing the static API key.
 * @returns A normalized {@link ProviderToken} ready for internal use.
 *
 * @see {@link RAWGToken}
 * @see {@link ProviderToken}
 * @see {@link rawgAuthAdapter}
 */
export const toRAWGProviderToken = (entity: RAWGToken): ProviderToken => {
  return {
    token: entity.apiKey,
    expiresAt: null,
    type: 'apiKey',
  }
}
