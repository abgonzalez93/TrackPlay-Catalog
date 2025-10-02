import { CategoryService } from './categoryService.interface'
import { CategoryList } from '@trackplay/core/schemas'
import { CategoryPort } from '@trackplay/core/ports'

/**
 * **Category Service**
 *
 * Domain-level service that provides a business-oriented abstraction
 * over the underlying {@link CategoryPort}.
 *
 * This layer defines **how** category-related operations are executed,
 * orchestrating provider interactions to retrieve normalized data
 * such as genres, platforms, and themes. It ensures that upper layers
 * (use cases, controllers) interact with a consistent and validated contract.
 *
 * ### Responsibilities
 * - Acts as the bridge between use cases and the infrastructure {@link CategoryPort}.
 * - Encapsulates logic for accessing and normalizing category data.
 * - Guarantees consistent data contracts across different providers.
 *
 * @param categoryPort - The infrastructure port responsible for provider communication.
 * @returns An implementation of the {@link CategoryService} interface exposing category operations.
 */
export const categoryService = (categoryPort: CategoryPort): CategoryService => {
  /**
   * Retrieves all available game genres from the active provider.
   *
   * @returns A {@link CategoryList} containing all supported genres.
   *
   * @throws {Error} If fetching genres fails or provider response is invalid.
   */
  const getGenres = async (): Promise<CategoryList> => await categoryPort.getGenres()

  /**
   * Retrieves all available game platforms from the active provider.
   *
   * @returns A {@link CategoryList} containing all supported platforms.
   *
   * @throws {Error} If fetching platforms fails or provider response is invalid.
   */
  const getPlatforms = async (): Promise<CategoryList> => await categoryPort.getPlatforms()

  /**
   * Retrieves all available game themes from the active provider.
   *
   * @returns A {@link CategoryList} containing all supported themes.
   *
   * @throws {Error} If fetching themes fails or provider response is invalid.
   */
  const getThemes = async (): Promise<CategoryList> => await categoryPort.getThemes()

  return {
    getGenres,
    getPlatforms,
    getThemes,
  }
}
