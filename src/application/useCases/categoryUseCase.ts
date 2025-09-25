import { CategoryList } from '@trackplay/core/schemas'
import { CategoryPort } from '@trackplay/core/ports'

/**
 * Category UseCase
 *
 * Provides application-level operations for retrieving game-related
 * categories (genres, platforms, themes) in a provider-agnostic way.
 *
 * This layer orchestrates calls to the {@link CategoryPort} and ensures
 * the application only works with normalized `CategoryList` data.
 */
export const categoryUseCase = (categoryPort: CategoryPort) => ({
  /**
   * Retrieves all available genres as domain-neutral categories.
   *
   * @returns {Promise<CategoryList>} A list of genres in normalized form.
   */
  getGenres: async (): Promise<CategoryList> => await categoryPort.getGenres(),

  /**
   * Retrieves all available platforms as domain-neutral categories.
   *
   * @returns {Promise<CategoryList>} A list of platforms in normalized form.
   */
  getPlatforms: async (): Promise<CategoryList> => await categoryPort.getPlatforms(),

  /**
   * Retrieves all available themes as domain-neutral categories.
   *
   * @returns {Promise<CategoryList>} A list of themes in normalized form.
   */
  getThemes: async (): Promise<CategoryList> => await categoryPort.getThemes(),
})
