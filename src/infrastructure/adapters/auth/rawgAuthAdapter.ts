import { ProviderTokenPort } from '@trackplay/core/ports'
import { ProviderToken } from '@trackplay/core/schemas'
import { toRAWGProviderToken } from '@mappers/index'

/**
 * **rawgAuthAdapter**
 *
 * Infrastructure-level adapter implementing the {@link ProviderTokenPort}
 * for the **RAWG** game data provider.
 *
 * ### Scope
 * - Provides authentication capability for RAWG using a static API key.
 * - Normalizes the key into a {@link ProviderToken} consumed by higher layers.
 *
 * ### Responsibilities
 * - Accept the configured RAWG API key as input.
 * - Wrap the API key into a domain-neutral {@link ProviderToken}
 *   via {@link toRAWGProviderToken}.
 * - Expose a unified {@link ProviderTokenPort} interface compatible with
 *   other providers (e.g., IGDB).
 *
 * ### Notes
 * - RAWG uses **static API keys**, not OAuth2.
 * - Tokens are **non-expiring** and do not require refresh or revocation.
 * - No network requests are performed; this adapter simply wraps the key.
 * - Should be instantiated through the container with a valid API key.
 *
 * @param apiKey - The configured RAWG API key from environment settings.
 * @returns A {@link ProviderTokenPort} instance for RAWG authentication.
 *
 * @see {@link toRAWGProviderToken}
 * @see {@link ProviderToken}
 * @see {@link ProviderTokenPort}
 */
export const rawgAuthAdapter = (apiKey: string): ProviderTokenPort => {
  /**
   * Requests the configured RAWG API key and wraps it
   * into a standardized {@link ProviderToken}.
   *
   * @returns A resolved {@link ProviderToken} containing the RAWG API key.
   */
  const requestToken = async (): Promise<ProviderToken> => toRAWGProviderToken({ apiKey })

  return {
    requestToken,
  }
}
