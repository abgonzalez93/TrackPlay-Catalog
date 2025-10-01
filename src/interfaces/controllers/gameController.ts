import { GameFiltersSchema, IdSchema } from '@trackplay/core/schemas'
import { getTranslationPath } from '@trackplay/core/utils'
import { HTTP_STATUS } from '@trackplay/core/constants'
import { validateSchema } from '@trackplay/core/utils'
import { GameUseCase } from '@useCases/index'
import { Request, Response } from 'express'

const path = getTranslationPath(import.meta.url)

/**
 * Game Controller
 *
 * Express controller responsible for handling HTTP routes related to games.
 * It serves as the entry point for game-related requests, delegating execution
 * to the {@link GameUseCase} and formatting results as HTTP JSON responses.
 *
 * Responsibilities:
 * - Map incoming HTTP requests to use case calls.
 * - Validate incoming request parameters and query data.
 * - Return standardized HTTP responses with appropriate status codes.
 *
 * Notes:
 * - This controller does not implement business logic; it only handles request/response orchestration.
 *
 */
export const gameController = (gameUseCase: GameUseCase) => {
  /**
   * GET /games/search
   *
   * Searches for games using query string filters.
   *
   * @param req - Express request object containing query parameters.
   *   - Validated against {@link GameFiltersSchema}.
   * @param res - Express response object used to send JSON output.
   * @returns 200 OK with a JSON array of matching games.
   * @throws BadRequestError - If filters are invalid.
   */
  const search = async (req: Request, res: Response): Promise<void> => {
    const filters = validateSchema(GameFiltersSchema, req.query, `${path}.invalid_filters`)
    const games = await gameUseCase.searchGames(filters)
    res.status(HTTP_STATUS.OK).json(games)
  }

  /**
   * GET /games/:id
   *
   * Retrieves a single game by its unique identifier.
   *
   * @param req - Express request object containing the `id` parameter.
   *   - Validated against {@link IdSchema}.
   * @param res - Express response object used to send JSON output.
   * @returns 200 OK with the game object.
   * @throws NotFoundError - If no game is found for the provided ID.
   * @throws BadRequestError - If the ID format is invalid.
   */
  const getById = async (req: Request, res: Response): Promise<void> => {
    const id = validateSchema(IdSchema, req.params.id, `${path}.invalid_id`)
    const game = await gameUseCase.getGameById(id)
    res.status(HTTP_STATUS.OK).json(game)
  }

  return {
    search,
    getById,
  }
}
