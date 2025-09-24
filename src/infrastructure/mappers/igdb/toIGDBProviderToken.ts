import { ProviderToken } from '@trackplay/core/schemas'
import { IGDBToken } from '@schemas/index'

/**
 * Maps a raw IGDB token response to a domain-neutral {@link ProviderToken}.
 *
 * This function transforms the provider-specific `IGDBToken` format
 * into the standard `ProviderToken` format used internally.
 *
 * @param entity - The raw token object returned by IGDB's authentication API.
 * @returns A normalized {@link ProviderToken} containing:
 * - `token`: The OAuth access token string.
 * - `expiresAt`: Absolute expiration time in milliseconds since epoch.
 * - `type`: The token type (always `"bearer"` for IGDB).
 */
export const toIGDBProviderToken = (entity: IGDBToken): ProviderToken => {
  return {
    token: entity.access_token,
    expiresAt: Date.now() + entity.expires_in * 1000,
    type: 'bearer',
  }
}
