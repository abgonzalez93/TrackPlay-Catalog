import { categoryRoutes, gameRoutes } from '@routes/index'
import { Express } from 'express'

/**
 * **Route Registrar**
 *
 * Central entry point for registering all application-level HTTP routes.
 *
 * ### Scope
 * - Integrates feature-specific routers (e.g., games, categories)
 *   into the main Express application instance.
 * - Defines the URL prefixes under which each route group is mounted.
 *
 * ### Responsibilities
 * - Attach modular routers to their respective base paths.
 * - Ensure all routes are accessible via a unified API structure.
 *
 * ### Notes
 * - This function is invoked during server initialization.
 * - All routers follow the same structure:
 *   - `/games` → {@link gameRoutes}
 *   - `/categories` → {@link categoryRoutes}
 *
 * @param app - The main Express application instance.
 * @returns void
 *
 * @see {@link gameRoutes}
 * @see {@link categoryRoutes}
 */
export const routes = (app: Express): void => {
  app.use('/games', gameRoutes)
  app.use('/categories', categoryRoutes)
}
