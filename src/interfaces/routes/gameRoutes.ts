import { container } from '@container/index'
import { Router } from 'express'

const gameControllers = container.controllers.game

/**
 * Express router for game endpoints.
 */
export const gameRoutes = Router()

gameRoutes.post('/search', gameControllers.search)
gameRoutes.get('/:id', gameControllers.getById)
