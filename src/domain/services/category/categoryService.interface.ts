import { CategoryList } from '@trackplay/core/schemas'

/**
 * **CategoryService (interface)**
 *
 * Application-layer contract defining **how category data is retrieved**
 * within the domain, independently of any external provider.
 *
 * ### Scope
 * - Exposes operations for obtaining normalized category collections.
 * - Acts as the bridge between {@link CategoryUseCase} and provider-specific ports.
 *
 * ### Semantics
 * - Returns validated {@link CategoryList} objects.
 * - Implementations are responsible for delegating data retrieval to underlying ports.
 */
export interface CategoryService {
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
