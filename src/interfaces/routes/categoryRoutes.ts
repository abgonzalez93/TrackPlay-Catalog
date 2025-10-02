import { container } from '@container/index'
import { Router } from 'express'

const categoryController = container.controllers.category

/**
 * Express router for category endpoints.
 */
export const categoryRoutes = Router()

categoryRoutes.get('/genres', categoryController.getGenres)
categoryRoutes.get('/platforms', categoryController.getPlatforms)
categoryRoutes.get('/themes', categoryController.getThemes)
