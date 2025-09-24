import { UnauthorizedError } from '@trackplay/core/errors'
import { igdbAuthAdapter } from './igdb/igdbAuthAdapter'
import { rawgAuthAdapter } from './rawg/rawgAuthAdapter'
import { currentProviderConfig } from '@config/index'
import { AuthPort } from '@trackplay/core/ports'

const adapters: Record<string, AuthPort> = {
  igdb: igdbAuthAdapter,
  rawg: rawgAuthAdapter,
}

/**
 * Auth Adapter Factory
 *
 * Exports the active authentication adapter depending on the
 * currently configured provider.
 */
export const authAdapter: AuthPort =
  adapters[currentProviderConfig.type] ??
  (() => {
    throw new UnauthorizedError('catalog.infrastructure.adapters.authAdapter.unsupported_provider')
  })()
