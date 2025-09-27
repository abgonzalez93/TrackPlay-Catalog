import {
  igdbAuthAdapter,
  rawgAuthAdapter,
  igdbCategoryAdapter,
  rawgCategoryAdapter,
  igdbGameAdapter,
  rawgGameAdapter,
} from '@adapters/index'
import { categoryService, gameService, tokenService } from '@services/index'
import { authUseCase, categoryUseCase, gameUseCase } from '@useCases/index'
import { AuthPort, CategoryPort, GamePort } from '@trackplay/core/ports'
import { categoryController, gameController } from '@controllers/index'
import { UnauthorizedError } from '@trackplay/core/errors'
import { currentProviderConfig } from '@config/index'

/**
 * Resolves and initializes all provider-specific adapters.
 *
 * Responsibilities:
 * - Detects the current provider type from {@link currentProviderConfig}.
 * - Instantiates the correct adapter implementations (Auth, Category, Game).
 * - Injects configuration (API URL, client ID, API key, etc.) for each provider.
 *
 * Notes:
 * - Extensible: new providers can be added via new `case` statements.
 * - Throws {@link UnauthorizedError} if provider type is unsupported.
 */
const resolveAdapters = (): {
  auth: AuthPort
  category: CategoryPort
  game: GamePort
} => {
  switch (currentProviderConfig.type) {
    case 'igdb': {
      const { tokenUrl, apiUrl, clientId, clientSecret } = currentProviderConfig

      const auth = igdbAuthAdapter(clientId, clientSecret, tokenUrl)
      const category = igdbCategoryAdapter(auth, apiUrl, clientId)
      const game = igdbGameAdapter(auth, apiUrl, clientId)

      return { auth, category, game }
    }

    case 'rawg': {
      const { apiUrl, apiKey } = currentProviderConfig

      const auth = rawgAuthAdapter(apiKey)
      const category = rawgCategoryAdapter(auth, apiUrl)
      const game = rawgGameAdapter(auth, apiUrl)

      return { auth, category, game }
    }

    default:
      throw new UnauthorizedError('catalog.infrastructure.container.unsupported_provider')
  }
}

// --------------------
// Adapters
// --------------------
const { auth: authAdapterInstance, category: categoryAdapterInstance, game: gameAdapterInstance } = resolveAdapters()

// --------------------
// Services
// --------------------
const categoryServiceInstance = categoryService(categoryAdapterInstance)
const gameServiceInstance = gameService(gameAdapterInstance)
const tokenServiceInstance = tokenService(authAdapterInstance)

// --------------------
// Use Cases
// --------------------
const authUseCaseInstance = authUseCase(tokenServiceInstance)
const categoryUseCaseInstance = categoryUseCase(categoryServiceInstance)
const gameUseCaseInstance = gameUseCase(gameServiceInstance)

// --------------------
// Controllers
// --------------------
const categoryControllerInstance = categoryController(categoryUseCaseInstance)
const gameControllerInstance = gameController(gameUseCaseInstance)

/**
 * Application Dependency Container
 *
 * Centralized dependency registry connecting all layers of the app
 * (Adapters, Services, Use Cases, Controllers).
 *
 * Responsibilities:
 * - Resolve all dependencies in a single place.
 * - Enforce provider-specific configuration injection.
 * - Prevent external layers from creating new instances manually.
 *
 * Layers:
 * - **Adapters** — Infrastructure-level implementations of ports (external APIs).
 * - **Services** — Business logic utilities and helpers.
 * - **Use Cases** — Application-level orchestration.
 * - **Controllers** — HTTP adapters (Express controllers).
 */
export const container = {
  adapters: {
    auth: authAdapterInstance,
    category: categoryAdapterInstance,
    game: gameAdapterInstance,
  },
  services: {
    category: categoryServiceInstance,
    game: gameServiceInstance,
    token: tokenServiceInstance,
  },
  useCases: {
    auth: authUseCaseInstance,
    category: categoryUseCaseInstance,
    game: gameUseCaseInstance,
  },
  controllers: {
    category: categoryControllerInstance,
    game: gameControllerInstance,
  },
}

/**
 * Type representing the full dependency container.
 *
 * Exposes typed access to all adapters, services, use cases, and controllers.
 */
export type Container = typeof container
