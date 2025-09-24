import { IGDBCategoryListSchema } from '@schemas/index'
import { validateSchema } from '@trackplay/core/utils'
import { CategoryList } from '@trackplay/core/schemas'
import { CategoryPort } from '@trackplay/core/ports'
import { executeQuery } from '@utils/index'
import { toCategory } from '@mappers/index'

const path = 'catalog.infrastructure.adapters.categoryAdapter'
const query = 'fields id,name,slug;'

/**
 * Fetches and normalizes category data from the external provider.
 *
 * Responsibilities:
 * - Executes a query against the given provider {@link endpoint}.
 * - Validates the raw response against {@link IGDBCategoryListSchema}.
 * - Maps provider-specific entities into domain-neutral {@link CategoryList} items
 *   using {@link toCategory}.
 *
 * Notes:
 * - Shared helper used by the category adapter for genres, platforms, and themes.
 * - Encapsulates repeated logic so adapter methods remain concise.
 *
 * @param endpoint - The provider resource to query (e.g., `"genres"`, `"platforms"`, `"themes"`).
 * @returns {Promise<CategoryList>} A promise resolving to a list of normalized
 * domain category entities.
 *
 */
const fetchCategories = async (endpoint: string): Promise<CategoryList> => {
  const raw = await executeQuery(endpoint, query, path)
  const categories = validateSchema(IGDBCategoryListSchema, raw, `${path}.invalid_format`)
  return categories.map(toCategory)
}

/**
 * Category Adapter
 *
 * Provides infrastructure-level implementation of the {@link CategoryPort}.
 * This adapter interacts with the external game provider to fetch raw
 * category data (genres, platforms, themes), validates the responses
 * against the {@link IGDBCategoryListSchema}, and maps them into
 * domain-neutral {@link CategoryList} entities.
 */
export const categoryAdapter: CategoryPort = {
  /**
   * Retrieves all available genres from the provider and maps them
   * into domain-neutral category entities.
   *
   * @returns {Promise<CategoryList>} A list of genres with normalized structure.
   */
  getGenres: async (): Promise<CategoryList> => await fetchCategories('genres'),

  /**
   * Retrieves all available platforms from the provider and maps them
   * into domain-neutral category entities.
   *
   * @returns {Promise<CategoryList>} A list of platforms with normalized structure.
   */
  getPlatforms: async (): Promise<CategoryList> => await fetchCategories('platforms'),

  /**
   * Retrieves all available themes from the provider and maps them
   * into domain-neutral category entities.
   *
   * @returns {Promise<CategoryList>} A list of themes with normalized structure.
   */
  getThemes: async (): Promise<CategoryList> => await fetchCategories('themes'),
}
