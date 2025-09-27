import { container } from '@container/index'
import { Router } from 'express'

const categoryControllers = container.controllers.category

/**
 * Express router for category endpoints.
 */
export const categoryRoutes = Router()

categoryRoutes.get('/genres', categoryControllers.getGenres)
categoryRoutes.get('/platforms', categoryControllers.getPlatforms)
categoryRoutes.get('/themes', categoryControllers.getThemes)
