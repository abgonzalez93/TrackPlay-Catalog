import { HTTP_STATUS } from '@trackplay/core/constants'
import { categoryUseCase } from '@useCases/index'
import { categoryAdapter } from '@adapters/index'
import { Request, Response } from 'express'

const categoryUseCaseInstance = categoryUseCase(categoryAdapter)

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
    const genres = await categoryUseCaseInstance.getGenres()
    res.status(HTTP_STATUS.OK).json(genres)
  },

  /**
   * Handles GET /categories/platforms
   *
   * Retrieves all available platforms as domain-neutral categories.
   */
  getPlatforms: async (_req: Request, res: Response): Promise<void> => {
    const platforms = await categoryUseCaseInstance.getPlatforms()
    res.status(HTTP_STATUS.OK).json(platforms)
  },

  /**
   * Handles GET /categories/themes
   *
   * Retrieves all available themes as domain-neutral categories.
   */
  getThemes: async (_req: Request, res: Response): Promise<void> => {
    const themes = await categoryUseCaseInstance.getThemes()
    res.status(HTTP_STATUS.OK).json(themes)
  },
}
