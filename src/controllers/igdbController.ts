import { IGDBGameFiltersSchema, IGDBIdSchema } from '@trackplay/core/schemas'
import { HTTP_STATUS } from '@trackplay/core/constants'
import { parseOrThrow } from '@trackplay/core/utils'
import { igdbService } from '@services/index'
import { Request, Response } from 'express'

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
    const filters = parseOrThrow(IGDBGameFiltersSchema, req.query)
    const games = await igdbService.searchGames(filters)
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
    const id = parseOrThrow(IGDBIdSchema, req.params.id)
    const game = await igdbService.getGameById(id)
    res.status(HTTP_STATUS.OK).json(game)
  },
}
