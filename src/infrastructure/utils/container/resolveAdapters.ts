import {
  igdbAuthAdapter,
  rawgAuthAdapter,
  igdbCategoryAdapter,
  rawgCategoryAdapter,
  igdbGameAdapter,
  rawgGameAdapter,
} from '@adapters/index'
import { AuthPort, CategoryPort, GamePort } from '@trackplay/core/ports'
import { UnauthorizedError } from '@trackplay/core/errors'
import { ProviderConfig } from '@schemas/index'

/**
 * Mapping of all available provider adapters.
 *
 * Defines the set of infrastructure-level adapter instances that implement
 * the corresponding ports for each domain entity. Each adapter is
 * responsible for integrating with an external game provider (e.g., IGDB, RAWG)
 * using provider-specific APIs and authentication mechanisms.
 *
 */
interface AdaptersMap {
  authAdapter: AuthPort
  categoryAdapter: CategoryPort
  gameAdapter: GamePort
}

/**
 * Assembles the complete adapter set (Auth, Category, Game)
 * for the currently active provider.
 *
 * This function centralizes shared instantiation logic between providers,
 * using an existing {@link AuthPort} instance to initialize dependent adapters.
 *
 * @param {AuthPort} authAdapter The authentication adapter already initialized for the provider.
 * @param {string} apiUrl The base API URL of the external provider.
 * @param {string} [clientId] Optional client identifier required by some providers (e.g., IGDB).
 * @returns {AdaptersMap} A fully assembled adapter set including Auth, Category, and Game.
 */
const assembleAdapters = (authAdapter: AuthPort, apiUrl: string, clientId?: string): AdaptersMap => {
  const categoryAdapter = clientId
    ? igdbCategoryAdapter(authAdapter, apiUrl, clientId)
    : rawgCategoryAdapter(authAdapter, apiUrl)

  const gameAdapter = clientId ? igdbGameAdapter(authAdapter, apiUrl, clientId) : rawgGameAdapter(authAdapter, apiUrl)

  return { authAdapter, categoryAdapter, gameAdapter }
}

/**
 * Resolves and initializes all provider-specific adapters.
 *
 * Determines the current external game provider based on {@link currentProviderConfig}
 * and constructs the corresponding adapter instances (Auth, Category, Game).
 *
 * Each adapter is automatically injected with its required configuration,
 * including API URLs, credentials, and authentication parameters.
 *
 * Responsibilities:
 * - Detects the active provider type (e.g., IGDB, RAWG).
 * - Instantiates the appropriate adapter implementations.
 * - Injects provider-specific configuration (API URL, client ID, API key, etc.).
 *
 * Notes:
 * - Extensible: new providers can be integrated by adding additional `case` branches.
 * - Throws {@link UnauthorizedError} if the configured provider is unsupported.
 *
 * @param {ProviderConfig} providerConfig
 *   The configuration object describing the active external provider.
 *   Its shape depends on the selected provider type:
 *   - **IGDB**: `{ type: 'igdb'; apiUrl: string; tokenUrl: string; clientId: string; clientSecret: string }`
 *   - **RAWG**: `{ type: 'rawg'; apiUrl: string; apiKey: string }`
 *
 * @returns {AdaptersMap} The fully initialized set of provider adapters.
 */
export const resolveAdapters = (providerConfig: ProviderConfig): AdaptersMap => {
  switch (providerConfig.type) {
    case 'igdb': {
      const { tokenUrl, apiUrl, clientId, clientSecret } = providerConfig
      const authAdapter = igdbAuthAdapter(clientId, clientSecret, tokenUrl)
      return assembleAdapters(authAdapter, apiUrl, clientId)
    }

    case 'rawg': {
      const { apiUrl, apiKey } = providerConfig
      const authAdapter = rawgAuthAdapter(apiKey)
      return assembleAdapters(authAdapter, apiUrl)
    }

    default:
      throw new UnauthorizedError('catalog.infrastructure.container.unsupported_provider')
  }
}
