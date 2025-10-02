import { HTTP_STATUS } from '@trackplay/core/constants'
import { CategoryUseCase } from '@useCases/index'
import { Request, Response } from 'express'

/**
 * **Category Controller**
 *
 * Express-level HTTP adapter responsible for handling requests related
 * to game categories (genres, platforms, themes).
 *
 * This controller defines **how** HTTP requests are mapped to
 * application-level operations within the {@link CategoryUseCase},
 * and **what** responses are returned to the client.
 *
 * ### Responsibilities
 * - Handle category-related HTTP routes.
 * - Delegate request execution to the {@link CategoryUseCase}.
 * - Serialize and send responses in standardized JSON format.
 * - Apply appropriate HTTP status codes.
 *
 * ### Notes
 * - This controller is **purely infrastructural** — it contains no
 *   business or domain logic.
 * - Errors are expected to be handled by a global error middleware.
 *
 * @param categoryUseCase - The {@link CategoryUseCase} instance providing category operations.
 * @returns An object exposing HTTP route handlers for categories.
 *
 * @see {@link CategoryUseCase}
 */
export const categoryController = (categoryUseCase: CategoryUseCase) => {
  /**
   * **GET /categories/genres**
   *
   * Retrieves all available game genres as normalized category entities.
   *
   * ### Flow
   * 1. Delegates the call to {@link CategoryUseCase.getGenres}.
   * 2. Returns the resulting list as a JSON array.
   *
   * @param _req - Express request object (unused).
   * @param res - Express response object used to send JSON output.
   * @returns Sends `200 OK` with an array of genre objects.
   */
  const getGenres = async (_req: Request, res: Response): Promise<void> => {
    const genres = await categoryUseCase.getGenres()
    res.status(HTTP_STATUS.OK).json(genres)
  }

  /**
   * **GET /categories/platforms**
   *
   * Retrieves all available game platforms as normalized category entities.
   *
   * ### Flow
   * 1. Calls {@link CategoryUseCase.getPlatforms}.
   * 2. Sends a standardized JSON response.
   *
   * @param _req - Express request object (unused).
   * @param res - Express response object used to send JSON output.
   * @returns Sends `200 OK` with an array of platform objects.
   */
  const getPlatforms = async (_req: Request, res: Response): Promise<void> => {
    const platforms = await categoryUseCase.getPlatforms()
    res.status(HTTP_STATUS.OK).json(platforms)
  }

  /**
   * **GET /categories/themes**
   *
   * Retrieves all available game themes as normalized category entities.
   *
   * ### Flow
   * 1. Calls {@link CategoryUseCase.getThemes}.
   * 2. Returns a JSON payload containing the list of themes.
   *
   * @param _req - Express request object (unused).
   * @param res - Express response object used to send JSON output.
   * @returns Sends `200 OK` with an array of theme objects.
   */
  const getThemes = async (_req: Request, res: Response): Promise<void> => {
    const themes = await categoryUseCase.getThemes()
    res.status(HTTP_STATUS.OK).json(themes)
  }

  return {
    getGenres,
    getPlatforms,
    getThemes,
  }
}
