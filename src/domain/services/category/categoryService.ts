import { CategoryService } from './categoryService.interface'
import { CategoryList } from '@trackplay/core/schemas'
import { CategoryPort } from '@trackplay/core/ports'

/**
 * Category Service
 *
 * Provides a business-oriented abstraction over the {@link CategoryPort}.
 * This service centralizes access to category data such as genres, platforms,
 * and themes. It is responsible for orchestrating category-related operations
 * at the business logic level.
 *
 * Responsibilities:
 * - Acts as a bridge between Use Cases and the infrastructure {@link CategoryPort}.
 * - Ensures a consistent contract for retrieving game categories.
 *
 */
export const categoryService = (categoryPort: CategoryPort): CategoryService => {
  /**
   * Retrieves all available game genres from the provider.
   */
  const getGenres = async (): Promise<CategoryList> => await categoryPort.getGenres()

  /**
   * Retrieves all available game platforms from the provider.
   */
  const getPlatforms = async (): Promise<CategoryList> => await categoryPort.getPlatforms()

  /**
   * Retrieves all available game themes from the provider.
   */
  const getThemes = async (): Promise<CategoryList> => await categoryPort.getThemes()

  return {
    getGenres,
    getPlatforms,
    getThemes,
  }
}
