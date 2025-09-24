import { UnauthorizedError } from '@trackplay/core/errors'
import { ProviderToken } from '@trackplay/core/schemas'
import { currentProviderConfig } from '@config/index'
import { toRAWGProviderToken } from '@mappers/index'
import { AuthPort } from '@trackplay/core/ports'

const path = 'catalog.infrastructure.adapters.rawgAuthAdapter'

/**
 * RAWG Auth Adapter
 *
 * RAWG does not require OAuth — it uses an API key. This adapter simply
 * returns the API key wrapped in a {@link ProviderToken}.
 */
export const rawgAuthAdapter: AuthPort = {
  requestToken: async (): Promise<ProviderToken> => {
    if (currentProviderConfig.type !== 'rawg') throw new UnauthorizedError(`${path}.wrong_provider`)
    return toRAWGProviderToken({ apiKey: currentProviderConfig.apiKey })
  },
}
