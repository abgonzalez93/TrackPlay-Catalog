import { CategoryList } from '@trackplay/core/schemas'

/**
 * Interface for the Category Use Case.
 *
 * Defines the application-level operations for retrieving game-related
 * categories in a provider-agnostic and normalized way.
 */
export interface CategoryUseCase {
  /**
   * Retrieves the list of available game genres.
   *
   * @returns A list of genre categories.
   */
  getGenres(): Promise<CategoryList>

  /**
   * Retrieves the list of available game platforms.
   *
   * @returns A list of platform categories.
   */
  getPlatforms(): Promise<CategoryList>

  /**
   * Retrieves the list of available game themes.
   *
   * @returns A list of theme categories.
   */
  getThemes(): Promise<CategoryList>
}
