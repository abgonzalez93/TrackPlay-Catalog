import { ConfigurationError, type Logger } from '@trackplay/core'
import { createIgdbProvider, type ProviderInfrastructure } from './providers/igdb/provider.helper.ts'
import type { CatalogEnv, CatalogSecrets } from '#types/config.type'

export const resolveProvider = (env: CatalogEnv, secrets: CatalogSecrets, logger: Logger): ProviderInfrastructure => {
  switch (env.GAME_PROVIDER) {
    case 'igdb':
      return createIgdbProvider(
        {
          type: 'igdb',
          tokenUrl: env.IGDB_TOKEN_URL,
          apiUrl: env.IGDB_API_URL,
          clientId: secrets.IGDB_CLIENT_ID,
          clientSecret: secrets.IGDB_CLIENT_SECRET,
        },
        logger,
      )
    default:
      throw new ConfigurationError({ message: 'Provider not supported' })
  }
}
