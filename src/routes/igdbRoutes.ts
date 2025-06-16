import { igdbController } from '@controllers/index'
import { Router } from 'express'

/**
 * Express router for game endpoints.
 */
export const igdbRoutes = Router()

igdbRoutes.post('/search', igdbController.search)
igdbRoutes.get('/:id', igdbController.getByIgdbId)
