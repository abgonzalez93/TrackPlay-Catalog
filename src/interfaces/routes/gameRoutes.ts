import { container } from '@container/index'
import { Router } from 'express'

const gameController = container.controllers.game

/**
 * Express router for game endpoints.
 */
export const gameRoutes = Router()

gameRoutes.post('/search', gameController.search)
gameRoutes.get('/:id', gameController.getById)
