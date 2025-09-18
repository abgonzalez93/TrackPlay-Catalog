import { GameFiltersSchema, GameIdSchema } from '@trackplay/core/schemas'
import { HTTP_STATUS } from '@trackplay/core/constants'
import { validateSchema } from '@trackplay/core/utils'
import { igdbProvider } from '@providers/index'
import { Request, Response } from 'express'

const path = 'igdb.controllers.igdbController'

/**
 * Controller for handling routes related to games.
 */
export const igdbController = {
  /**
   * Search games by query string.
   *
   * @route GET /games/search
   * @param req - Express request object
   * @param res - Express response object
   */
  search: async (req: Request, res: Response): Promise<void> => {
    const filters = validateSchema(GameFiltersSchema, req.query, `${path}.invalid_filters`)
    const games = await igdbProvider.searchGames(filters)
    res.status(HTTP_STATUS.OK).json(games)
  },

  /**
   * Get a game by its IGDB ID.
   *
   * @route GET /games/:id
   * @param req - Express request object
   * @param res - Express response object
   */
  getByIgdbId: async (req: Request, res: Response): Promise<void> => {
    const id = validateSchema(GameIdSchema, req.params.id, `${path}.invalid_id`)
    const game = await igdbProvider.getGameById(id)
    res.status(HTTP_STATUS.OK).json(game)
  },
}
