import { GameFiltersSchema, IdSchema } from '@trackplay/core/schemas'
import { getTranslationPath } from '@trackplay/core/utils'
import { HTTP_STATUS } from '@trackplay/core/constants'
import { validateSchema } from '@trackplay/core/utils'
import { GameUseCase } from '@useCases/index'
import { Request, Response } from 'express'

const path = getTranslationPath(import.meta.url)

/**
 * **Game Controller**
 *
 * Express-level HTTP adapter responsible for managing routes related
 * to game data (search and retrieval).
 *
 * This controller defines **how** incoming HTTP requests are mapped
 * to application-level operations in the {@link GameUseCase}, and
 * **what** responses are returned to clients.
 *
 * ### Responsibilities
 * - Handle `/games` HTTP routes (search and get-by-ID operations).
 * - Validate request parameters and query filters.
 * - Delegate execution to the {@link GameUseCase}.
 * - Serialize results into standardized JSON responses.
 * - Apply appropriate HTTP status codes.
 *
 * ### Notes
 * - This controller is **purely infrastructural** — it contains no
 *   domain or business logic.
 * - Validation errors are raised using {@link BadRequestError}.
 * - Missing entities trigger {@link NotFoundError}.
 * - A global error middleware is expected to format and handle exceptions.
 *
 * @param gameUseCase - The {@link GameUseCase} instance providing game operations.
 * @returns An object exposing route handlers for game endpoints.
 *
 * @see {@link GameUseCase}
 * @see {@link GameFiltersSchema}
 * @see {@link IdSchema}
 */
export const gameController = (gameUseCase: GameUseCase) => {
  /**
   * **GET /games/search**
   *
   * Searches for games based on query string filters.
   *
   * ### Flow
   * 1. Validates the incoming query parameters using {@link GameFiltersSchema}.
   * 2. Delegates to {@link GameUseCase.searchGames}.
   * 3. Returns a JSON array of games matching the provided filters.
   *
   * ### Notes
   * - Returns an empty array if no games match the filters.
   * - Throws a `BadRequestError` if the query is invalid.
   *
   * @param req - Express request containing the query parameters.
   * @param res - Express response used to return the JSON result.
   *
   * @returns Sends `200 OK` with an array of matching game entities.
   * @throws {BadRequestError} If the filters are invalid.
   */
  const search = async (req: Request, res: Response): Promise<void> => {
    const filters = validateSchema(GameFiltersSchema, req.query, `${path}.invalid_filters`)
    const games = await gameUseCase.searchGames(filters)
    res.status(HTTP_STATUS.OK).json(games)
  }

  /**
   * **GET /games/:id**
   *
   * Retrieves a single game entity by its unique identifier.
   *
   * ### Flow
   * 1. Validates the `id` parameter using {@link IdSchema}.
   * 2. Calls {@link GameUseCase.getGameById}.
   * 3. Returns the retrieved game entity in JSON format.
   *
   * ### Notes
   * - Throws a `NotFoundError` if no game exists for the given ID.
   * - Throws a `BadRequestError` if the ID format is invalid.
   *
   * @param req - Express request containing the `id` route parameter.
   * @param res - Express response used to send the JSON output.
   *
   * @returns Sends `200 OK` with the retrieved {@link Game} object.
   * @throws {NotFoundError} If the game is not found.
   * @throws {BadRequestError} If the `id` parameter is invalid.
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
