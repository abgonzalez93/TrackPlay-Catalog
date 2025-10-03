import {
  igdbAuthAdapter,
  rawgAuthAdapter,
  igdbCategoryAdapter,
  rawgCategoryAdapter,
  igdbGameAdapter,
  rawgGameAdapter,
} from '@adapters/index'
import { ProviderTokenPort, CategoryPort, GamePort } from '@trackplay/core/ports'
import { getTranslationPath } from '@trackplay/core/utils'
import { UnauthorizedError } from '@trackplay/core/errors'
import { ProviderConfig } from '@schemas/index'

const path = getTranslationPath(import.meta.url)

/**
 * **Adapters Map**
 *
 * Defines the structure of the adapter set for a given provider.
 * Each adapter implements one of the application’s core ports:
 * - {@link ProviderTokenPort}
 * - {@link CategoryPort}
 * - {@link GamePort}
 *
 * These adapters serve as the infrastructure layer implementations,
 * integrating directly with external provider APIs (e.g., IGDB, RAWG).
 */
interface AdaptersMap {
  authAdapter: ProviderTokenPort
  categoryAdapter: CategoryPort
  gameAdapter: GamePort
}

/**
 * **Assemble Adapters**
 *
 * Internal factory function that composes the complete set of adapters
 * (Auth, Category, Game) for a specific external provider.
 *
 * It centralizes the instantiation logic shared between providers,
 * ensuring that category and game adapters receive the same
 * authenticated {@link ProviderTokenPort} instance.
 *
 * ### Responsibilities
 * - Initialize dependent adapters (Category, Game) using the shared ProviderTokenPort.
 * - Inject provider-specific configuration values (API URL, client ID, etc.).
 * - Maintain a consistent contract across different providers.
 *
 * @param authAdapter - The already initialized authentication adapter for the provider.
 * @param apiUrl - The base API URL for the provider.
 * @param clientId - Optional client identifier (required by IGDB).
 * @returns A complete {@link AdaptersMap} including all initialized adapters.
 */
const assembleAdapters = (authAdapter: ProviderTokenPort, apiUrl: string, clientId?: string): AdaptersMap => {
  const categoryAdapter = clientId
    ? igdbCategoryAdapter(authAdapter, apiUrl, clientId)
    : rawgCategoryAdapter(authAdapter, apiUrl)

  const gameAdapter = clientId ? igdbGameAdapter(authAdapter, apiUrl, clientId) : rawgGameAdapter(authAdapter, apiUrl)

  return { authAdapter, categoryAdapter, gameAdapter }
}

/**
 * **Resolve Adapters**
 *
 * High-level factory that resolves and initializes all
 * provider-specific adapters (Auth, Category, Game) based on the
 * current {@link ProviderConfig}.
 *
 * This function defines **how** the active external provider
 * is detected and instantiated at runtime. It abstracts away
 * all provider-specific setup, allowing the rest of the application
 * to work with a unified adapter interface.
 *
 * ### Responsibilities
 * - Detect the active provider type (`igdb`, `rawg`, etc.).
 * - Instantiate the appropriate adapter implementations.
 * - Inject provider-specific credentials and configuration values.
 * - Throw explicit errors for unsupported or misconfigured providers.
 *
 * ### Notes
 * - Easily extensible: new providers can be integrated by adding
 *   new `case` branches.
 * - Serves as the main entry point for infrastructure-level composition.
 *
 * @param providerConfig - The configuration object describing the active provider.
 *   Its shape depends on the selected provider type:
 *   - **IGDB**: `{ type: 'igdb'; apiUrl: string; tokenUrl: string; clientId: string; clientSecret: string }`
 *   - **RAWG**: `{ type: 'rawg'; apiUrl: string; apiKey: string }`
 *
 * @returns The fully initialized {@link AdaptersMap} for the active provider.
 *
 * @throws {UnauthorizedError} If the configured provider type is unsupported.
 *
 * @see {@link ProviderConfig}
 * @see {@link assembleAdapters}
 * @see {@link igdbAuthAdapter}
 * @see {@link rawgAuthAdapter}
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
      throw new UnauthorizedError(`${path}.unsupported_provider`)
  }
}
