import { CategoryUseCase } from './categoryUseCase.interface'
import { CategoryList } from '@trackplay/core/schemas'
import { CategoryService } from '@services/index'

/**
 * Category Use Case
 *
 * Encapsulates application-level operations for retrieving categories such as
 * genres, platforms, and themes. This ensures that the application interacts
 * only with normalized and provider-agnostic {@link CategoryList} data.
 *
 * Responsibilities:
 * - Defines **what** the application can do with categories.
 * - Delegates execution to the {@link CategoryService}.
 * - Ensures domain-neutral interactions with category data.
 *
 */
export const categoryUseCase = (categoryService: CategoryService): CategoryUseCase => {
  /**
   * Retrieves all available game genres.
   * Delegates execution to the {@link CategoryService}.
   */
  const getGenres = async (): Promise<CategoryList> => await categoryService.getGenres()

  /**
   * Retrieves all available game platforms.
   * Delegates execution to the {@link CategoryService}.
   */
  const getPlatforms = async (): Promise<CategoryList> => await categoryService.getPlatforms()

  /**
   * Retrieves all available game themes.
   * Delegates execution to the {@link CategoryService}.
   */
  const getThemes = async (): Promise<CategoryList> => await categoryService.getThemes()

  return {
    getGenres,
    getPlatforms,
    getThemes,
  }
}
