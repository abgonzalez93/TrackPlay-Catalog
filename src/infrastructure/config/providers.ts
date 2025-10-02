import { ProviderConfig } from '@schemas/index'
import { getEnvConfig } from '@config/index'

const { GAME_PROVIDER, IGDB_TOKEN_URL, IGDB_API_URL, IGDB_CLIENT_ID, IGDB_CLIENT_SECRET, RAWG_API_URL, RAWG_API_KEY } =
  getEnvConfig

/**
 * **Provider Configuration**
 *
 * Centralized configuration registry for all supported external game data providers.
 *
 * This module defines provider-specific credentials, URLs, and access parameters,
 * and determines the currently active provider dynamically from environment variables.
 * It ensures that infrastructure components (e.g., adapters, clients) can retrieve
 * consistent and strongly typed configuration data without coupling to environment logic.
 *
 * ### Responsibilities
 * - Define available provider configurations (`igdb`, `rawg`, etc.).
 * - Resolve the active provider based on the `GAME_PROVIDER` environment variable.
 * - Expose a typed {@link ProviderConfig} for the current provider.
 *
 * ### Notes
 * - Defaults to **IGDB** if `GAME_PROVIDER` is missing or invalid.
 * - Each provider entry includes credentials and endpoint URLs specific to its API.
 * - This module should be imported only by infrastructure-level components.
 *
 * @see {@link ProviderConfig}
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

/**
 * Represents the available provider keys within the {@link providers} map.
 */
type ProviderName = keyof typeof providers

/**
 * **Active Provider Name**
 *
 * Resolves the currently active game data provider name from the `GAME_PROVIDER`
 * environment variable. If undefined or invalid, defaults to `"igdb"`.
 *
 * @type {ProviderName}
 * @default "igdb"
 */
const currentProvider: ProviderName = GAME_PROVIDER && GAME_PROVIDER in providers ? (GAME_PROVIDER as ProviderName) : 'igdb'

/**
 * **Current Provider Configuration**
 *
 * The active {@link ProviderConfig} corresponding to the selected provider.
 * Includes authentication credentials, API URLs, and request parameters
 * required by downstream adapters (e.g., {@link igdbAuthAdapter}).
 *
 * @constant
 * @type {ProviderConfig}
 */
export const currentProviderConfig: ProviderConfig = providers[currentProvider]
