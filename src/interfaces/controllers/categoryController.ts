import { HTTP_STATUS } from '@trackplay/core/constants'
import { categoryUseCase } from '@useCases/index'
import { Request, Response } from 'express'

/**
 * Controller for handling routes related to categories.
 */
export const categoryController = {
  /**
   * Handles GET /categories/genres
   *
   * Retrieves all available genres as domain-neutral categories.
   */
  getGenres: async (_req: Request, res: Response): Promise<void> => {
    const genres = await categoryUseCase.getGenres()
    res.status(HTTP_STATUS.OK).json(genres)
  },

  /**
   * Handles GET /categories/platforms
   *
   * Retrieves all available platforms as domain-neutral categories.
   */
  getPlatforms: async (_req: Request, res: Response): Promise<void> => {
    const platforms = await categoryUseCase.getPlatforms()
    res.status(HTTP_STATUS.OK).json(platforms)
  },

  /**
   * Handles GET /categories/themes
   *
   * Retrieves all available themes as domain-neutral categories.
   */
  getThemes: async (_req: Request, res: Response): Promise<void> => {
    const themes = await categoryUseCase.getThemes()
    res.status(HTTP_STATUS.OK).json(themes)
  },
}
