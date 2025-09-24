import { categoryRoutes, gameRoutes } from '@routes/index'
import { Express } from 'express'

/**
 * Registers all application routes.
 *
 * @param app - The Express application instance
 */
export const routes = (app: Express): void => {
  app.use('/games', gameRoutes)
  app.use('/categories', categoryRoutes)
}
