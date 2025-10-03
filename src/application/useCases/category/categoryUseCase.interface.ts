import { CategoryList } from '@trackplay/core/schemas'

/**
 * **CategoryUseCase (interface)**
 *
 * Application-layer contract defining **what** category-related operations
 * are available within the domain.
 *
 * It abstracts provider-specific details and ensures that all returned data
 * is **normalized** and **provider-agnostic**.
 *
 * ### Scope
 * - Declares operations for retrieving game-related categories.
 * - Ensures consistent data shape across different external providers.
 *
 * ### Semantics
 * - Each method resolves to a validated and normalized {@link CategoryList}.
 * - Implementations may fetch data from external sources or caches.
 */
export interface CategoryUseCase {
  /**
   * Retrieves all available game genres.
   *
   * @returns A promise resolving to a {@link CategoryList} of genres.
   */
  getGenres(): Promise<CategoryList>

  /**
   * Retrieves all available game platforms.
   *
   * @returns A promise resolving to a {@link CategoryList} of platforms.
   */
  getPlatforms(): Promise<CategoryList>

  /**
   * Retrieves all available game themes.
   *
   * @returns A promise resolving to a {@link CategoryList} of themes.
   */
  getThemes(): Promise<CategoryList>
}
