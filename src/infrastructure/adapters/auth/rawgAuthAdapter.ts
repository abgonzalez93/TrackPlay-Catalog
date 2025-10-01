import { ProviderToken } from '@trackplay/core/schemas'
import { toRAWGProviderToken } from '@mappers/index'
import { AuthPort } from '@trackplay/core/ports'

/**
 * RAWG Auth Adapter
 *
 * This adapter provides the {@link AuthPort} implementation for RAWG.
 * Unlike IGDB/Twitch, RAWG does **not** use OAuth; instead it relies
 * on a static API key provided at configuration time.
 *
 * Responsibilities
 * - Accept the configured RAWG API key as input.
 * - Wrap the API key into a domain-neutral {@link ProviderToken} using {@link toRAWGProviderToken}.
 * - Expose a consistent {@link AuthPort} interface for higher layers.
 *
 * Notes
 * - RAWG API keys are treated as **non-expiring** (no refresh or revocation).
 * - No network requests are performed by this adapter.
 * - Error normalization is minimal, as failures are only possible if misconfigured.
 * - Should be instantiated via the container with a valid RAWG API key.
 *
 * @param apiKey - The configured RAWG API key.
 * @returns An {@link AuthPort} implementation for RAWG authentication.
 *
 */
export const rawgAuthAdapter = (apiKey: string): AuthPort => {
  /**
   * Returns the configured RAWG API key wrapped in a {@link ProviderToken}.
   *
   * @returns A {@link ProviderToken} representing the RAWG API key.
   */
  const requestToken = async (): Promise<ProviderToken> => toRAWGProviderToken({ apiKey })

  return {
    requestToken,
  }
}
