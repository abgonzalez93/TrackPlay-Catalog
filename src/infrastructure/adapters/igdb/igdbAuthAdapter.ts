import { TrackPlayError, UnauthorizedError } from '@trackplay/core/errors'
import { apiFetch, validateSchema } from '@trackplay/core/utils'
import { ProviderToken } from '@trackplay/core/schemas'
import { currentProviderConfig } from '@config/index'
import { toIGDBProviderToken } from '@mappers/index'
import { IGDBTokenSchema } from '@schemas/index'
import { AuthPort } from '@trackplay/core/ports'

const path = 'catalog.infrastructure.adapters.igdbAuthAdapter'

/**
 * IGDB Auth Adapter
 *
 * Handles OAuth authentication with IGDB/Twitch API by exchanging client
 * credentials for a bearer token.
 */
export const igdbAuthAdapter: AuthPort = {
  requestToken: async (): Promise<ProviderToken> => {
    if (currentProviderConfig.type !== 'igdb') throw new UnauthorizedError(`${path}.wrong_provider`)

    try {
      const raw = await apiFetch.post<unknown>(currentProviderConfig.tokenUrl, {
        body: new URLSearchParams({
          client_id: currentProviderConfig.clientId,
          client_secret: currentProviderConfig.clientSecret,
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
}
