import { GameFiltersSchema, IdSchema } from '@trackplay/core/schemas'
import { HTTP_STATUS } from '@trackplay/core/constants'
import { validateSchema } from '@trackplay/core/utils'
import { gameUseCase } from '@useCases/index'
import { Request, Response } from 'express'

const path = 'catalog.interfaces.controllers.gameController'

/**
 * Controller for handling routes related to games.
 */
export const gameController = {
  /**
   * Search games by query string.
   *
   * @route GET /games/search
   * @param req - Express request object
   * @param res - Express response object
   */
  search: async (req: Request, res: Response): Promise<void> => {
    const filters = validateSchema(GameFiltersSchema, req.query, `${path}.invalid_filters`)
    const games = await gameUseCase.searchGames(filters)
    res.status(HTTP_STATUS.OK).json(games)
  },

  /**
   * Get a game by its ID.
   *
   * @route GET /games/:id
   * @param req - Express request object
   * @param res - Express response object
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    const id = validateSchema(IdSchema, req.params.id, `${path}.invalid_id`)
    const game = await gameUseCase.getGameById(id)
    res.status(HTTP_STATUS.OK).json(game)
  },
}
