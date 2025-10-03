import { container } from '@container/index'
import { Router } from 'express'

const categoryController = container.controllers.category

/**
 * **Category Routes**
 *
 * Defines the Express router responsible for handling all category-related endpoints.
 *
 * ### Scope
 * - Maps HTTP routes to corresponding controller methods in {@link categoryController}.
 * - Exposes read-only endpoints for retrieving genres, platforms, and themes.
 *
 * ### Responsibilities
 * - Bind REST routes to controller actions.
 * - Serve as the entry point for category-related requests in the HTTP layer.
 *
 * ### Notes
 * - Each route delegates request handling to the {@link CategoryUseCase}
 *   through the controller layer.
 * - All responses are normalized JSON objects following application conventions.
 *
 * @see {@link categoryController}
 * @see {@link CategoryUseCase}
 */
export const categoryRoutes = Router()

categoryRoutes.get('/genres', categoryController.getGenres)
categoryRoutes.get('/platforms', categoryController.getPlatforms)
categoryRoutes.get('/themes', categoryController.getThemes)
