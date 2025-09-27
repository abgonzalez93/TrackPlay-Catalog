import { categoryService, gameService, tokenService } from '@services/index'
import { authUseCase, categoryUseCase, gameUseCase } from '@useCases/index'
import { categoryController, gameController } from '@controllers/index'
import { resolveAdapters } from '@utils/index'

// --------------------
// Adapters
// --------------------
const {
  authAdapter: authAdapterInstance,
  categoryAdapter: categoryAdapterInstance,
  gameAdapter: gameAdapterInstance,
} = resolveAdapters()

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
