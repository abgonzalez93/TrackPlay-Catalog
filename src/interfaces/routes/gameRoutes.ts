import { gameController } from '@controllers/index'
import { Router } from 'express'

/**
 * Express router for game endpoints.
 */
export const gameRoutes = Router()

gameRoutes.post('/search', gameController.search)
gameRoutes.get('/:id', gameController.getById)
