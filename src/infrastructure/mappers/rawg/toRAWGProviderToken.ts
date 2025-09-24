import { ProviderToken } from '@trackplay/core/schemas'
import { RAWGToken } from '@schemas/index'

/**
 * Maps a RAWG API key to a domain-neutral {@link ProviderToken}.
 *
 * Unlike OAuth-based providers (e.g., IGDB), RAWG uses a static API key
 * without expiration. This function normalizes the RAWG-specific format
 * into the standard `ProviderToken` shape used internally.
 *
 * @param entity - The RAWG token object containing the API key.
 * @returns A {@link ProviderToken} with:
 * - `token`: The RAWG API key string.
 * - `expiresAt`: Always `null`, since RAWG keys do not expire.
 * - `type`: The token type, always `"apiKey"`.
 */
export const toRAWGProviderToken = (entity: RAWGToken): ProviderToken => {
  return {
    token: entity.apiKey,
    expiresAt: null,
    type: 'apiKey',
  }
}
