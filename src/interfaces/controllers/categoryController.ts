import { HTTP_STATUS } from '@trackplay/core/constants'
import { CategoryUseCase } from '@useCases/index'
import { Request, Response } from 'express'

/**
 * Category Controller
 *
 * Express controller responsible for handling HTTP routes related to game categories.
 * It acts as an entry point for category-related requests, delegating execution to
 * the {@link CategoryUseCase} and formatting responses into HTTP JSON payloads.
 *
 * Responsibilities:
 * - Map incoming HTTP requests to application-level use case calls.
 * - Convert use case results into standardized HTTP responses.
 * - Ensure proper status codes and JSON formatting.
 *
 * Notes:
 * - This controller does not contain domain or business logic; it strictly handles
 *   request/response orchestration.
 *
 */
export const categoryController = (categoryUseCase: CategoryUseCase) => ({
  /**
   * GET /categories/genres
   *
   * Retrieves all available game genres as domain-neutral categories.
   *
   * @param _req - Express request object (unused).
   * @param res - Express response object used to send JSON output.
   *
   * @returns 200 OK with a JSON array of genres.
   */
  getGenres: async (_req: Request, res: Response): Promise<void> => {
    const genres = await categoryUseCase.getGenres()
    res.status(HTTP_STATUS.OK).json(genres)
  },

  /**
   * GET /categories/platforms
   *
   * Retrieves all available game platforms as domain-neutral categories.
   *
   * @param _req - Express request object (unused).
   * @param res - Express response object used to send JSON output.
   * @returns 200 OK with a JSON array of platforms.
   */
  getPlatforms: async (_req: Request, res: Response): Promise<void> => {
    const platforms = await categoryUseCase.getPlatforms()
    res.status(HTTP_STATUS.OK).json(platforms)
  },

  /**
   * GET /categories/themes
   *
   * Retrieves all available game themes as domain-neutral categories.
   *
   * @param _req - Express request object (unused).
   * @param res - Express response object used to send JSON output.
   * @returns 200 OK with a JSON array of themes.
   */
  getThemes: async (_req: Request, res: Response): Promise<void> => {
    const themes = await categoryUseCase.getThemes()
    res.status(HTTP_STATUS.OK).json(themes)
  },
})
