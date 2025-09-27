import { CategoryList } from '@trackplay/core/schemas'

/**
 * Interface for the Category Service.
 *
 * Provides contract definitions for retrieving game-related categories
 * such as genres, platforms, and themes.
 */
export interface CategoryService {
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
