import { container } from '@container/index'
import { Router } from 'express'

const gameController = container.controllers.game

/**
 * **Game Routes**
 *
 * Defines the Express router responsible for handling all game-related endpoints.
 *
 * ### Scope
 * - Maps incoming HTTP routes to their corresponding controller actions.
 * - Serves as the entry point for game-related operations in the HTTP layer.
 *
 * ### Responsibilities
 * - Bind REST routes to controller methods defined in {@link gameController}.
 * - Expose endpoints for game search and retrieval by ID.
 *
 * ### Routes Overview
 * - `POST /games/search` — Searches for games using filter criteria.
 * - `GET /games/:id` — Retrieves a specific game by its unique identifier.
 *
 * ### Notes
 * - Delegates all logic to the {@link GameUseCase} through the controller layer.
 * - Returns standardized JSON responses following application conventions.
 *
 * @see {@link gameController}
 * @see {@link GameUseCase}
 */
export const gameRoutes = Router()

gameRoutes.post('/search', gameController.search)
gameRoutes.get('/:id', gameController.getById)
