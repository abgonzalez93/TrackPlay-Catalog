import { categoryService, gameService, tokenService } from '@services/index'
import { authUseCase, categoryUseCase, gameUseCase } from '@useCases/index'
import { categoryController, gameController } from '@controllers/index'
import { currentProviderConfig } from '@config/index'
import { resolveAdapters } from '@utils/index'

// --------------------
// Adapters
// --------------------
const {
  authAdapter: authAdapterInstance,
  categoryAdapter: categoryAdapterInstance,
  gameAdapter: gameAdapterInstance,
} = resolveAdapters(currentProviderConfig)

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
 * **Application Dependency Container**
 *
 * Centralized registry that composes and wires together all core layers
 * of the application following the **Hexagonal Architecture** pattern.
 *
 * This container acts as the single source of truth for dependency resolution,
 * ensuring that all components — from infrastructure adapters to controllers —
 * are initialized with their required collaborators.
 *
 * ### Responsibilities
 * - Resolve and compose all dependencies across architectural layers.
 * - Enforce provider-specific injection based on {@link currentProviderConfig}.
 * - Expose fully initialized instances to upper layers (e.g., HTTP controllers).
 * - Prevent external modules from manually instantiating dependencies.
 *
 * ### Layers
 * - **Adapters** — Infrastructure-level implementations of ports (e.g., IGDB APIs).
 * - **Services** — Domain/business logic orchestrators built atop adapters.
 * - **Use Cases** — Application-level actions coordinating domain workflows.
 * - **Controllers** — HTTP-level endpoints delegating to use cases.
 *
 * ### Notes
 * - This module should be imported only once at application bootstrap.
 * - It guarantees a consistent dependency graph for all runtime components.
 *
 * @constant
 * @see {@link resolveAdapters}
 * @see {@link currentProviderConfig}
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
 * **Container Type**
 *
 * Strongly typed representation of the dependency container.
 * Provides compile-time safety when accessing adapters, services,
 * use cases, and controllers throughout the codebase.
 *
 * @type {object}
 */
export type Container = typeof container
