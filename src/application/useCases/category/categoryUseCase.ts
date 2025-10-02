import { CategoryUseCase } from './categoryUseCase.interface'
import { CategoryList } from '@trackplay/core/schemas'
import { CategoryService } from '@services/index'

/**
 * **Category Use Case**
 *
 * Application-level orchestrator responsible for exposing read-only operations
 * related to game categories — such as genres, platforms, and themes.
 *
 * This layer defines **what** category data can be accessed by the application,
 * while delegating the **how** to the injected {@link CategoryService}.
 * It ensures that the returned data remains normalized and provider-agnostic.
 *
 * ### Responsibilities
 * - Defines available operations on category data (genres, platforms, themes).
 * - Delegates execution to the {@link CategoryService}.
 * - Guarantees domain-neutral and validated category representations.
 *
 * @param categoryService - The domain service handling category retrieval.
 * @returns An implementation of the {@link CategoryUseCase} interface.
 */
export const categoryUseCase = (categoryService: CategoryService): CategoryUseCase => {
  /**
   * Retrieves all available game genres.
   *
   * @returns A {@link CategoryList} containing all supported genres.
   *
   * @throws {Error} If the underlying service fails or returns invalid data.
   */
  const getGenres = async (): Promise<CategoryList> => await categoryService.getGenres()

  /**
   * Retrieves all available game platforms.
   *
   * @returns A {@link CategoryList} containing all supported platforms.
   *
   * @throws {Error} If the underlying service fails or returns invalid data.
   */
  const getPlatforms = async (): Promise<CategoryList> => await categoryService.getPlatforms()

  /**
   * Retrieves all available game themes.
   *
   * @returns A {@link CategoryList} containing all supported themes.
   *
   * @throws {Error} If the underlying service fails or returns invalid data.
   */
  const getThemes = async (): Promise<CategoryList> => await categoryService.getThemes()

  return {
    getGenres,
    getPlatforms,
    getThemes,
  }
}
