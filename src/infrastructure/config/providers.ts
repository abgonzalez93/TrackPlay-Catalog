import { ProviderConfig } from '@schemas/index'
import { getEnvConfig } from '@config/index'

const { GAME_PROVIDER, IGDB_TOKEN_URL, IGDB_API_URL, IGDB_CLIENT_ID, IGDB_CLIENT_SECRET, RAWG_API_URL, RAWG_API_KEY } =
  getEnvConfig

/**
 * Provider Configuration
 *
 * Defines available game data providers and selects the active provider
 * based on environment variables. Defaults to **IGDB** if no valid provider
 * is configured in the environment.
 *
 * Responsibilities:
 * - Exposes configuration values (URLs, client credentials) for each provider.
 * - Determines the current provider dynamically at runtime.
 * - Provides a single `currentProviderConfig` object to be used throughout
 *   the infrastructure layer (e.g., adapters, clients).
 */
const providers: Record<'igdb' | 'rawg', ProviderConfig> = {
  igdb: {
    type: 'igdb',
    tokenUrl: IGDB_TOKEN_URL,
    apiUrl: IGDB_API_URL,
    clientId: IGDB_CLIENT_ID,
    clientSecret: IGDB_CLIENT_SECRET,
  },
  rawg: {
    type: 'rawg',
    apiUrl: RAWG_API_URL,
    apiKey: RAWG_API_KEY,
  },
}

type ProviderName = keyof typeof providers

/**
 * The active provider name, resolved from the environment variable
 * `GAME_PROVIDER`. Defaults to `"igdb"` if the value is missing or invalid.
 */
const currentProvider: ProviderName = GAME_PROVIDER && GAME_PROVIDER in providers ? (GAME_PROVIDER as ProviderName) : 'igdb'

/**
 * The configuration object for the currently active provider.
 * Contains credentials and API endpoints required for authentication
 * and data fetching.
 */
export const currentProviderConfig: ProviderConfig = providers[currentProvider]
