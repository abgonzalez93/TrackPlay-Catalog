import { categoryController } from '@controllers/index'
import { Router } from 'express'

/**
 * Express router for category endpoints.
 */
export const categoryRoutes = Router()

categoryRoutes.get('/genres', categoryController.getGenres)
categoryRoutes.get('/platforms', categoryController.getPlatforms)
categoryRoutes.get('/themes', categoryController.getThemes)
