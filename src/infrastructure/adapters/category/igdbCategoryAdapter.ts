import { AuthPort, CategoryPort } from '@trackplay/core/ports'
import { IGDBCategoryListSchema } from '@schemas/index'
import { fetchAndMapFromIGDB } from '../helpers/index'
import { CategoryList } from '@trackplay/core/schemas'
import { toCategory } from '@mappers/index'

const path = 'catalog.infrastructure.adapters.igdb.categoryAdapter'
const query = 'fields id,name,slug;'

/**
 * IGDB Category Adapter
 *
 * Infrastructure-level adapter that implements the {@link CategoryPort}.
 *
 * Responsibilities:
 * - Fetches category data (genres, platforms, themes) from IGDB.
 * - Validates API responses using {@link IGDBCategoryListSchema}.
 * - Maps validated data into domain-neutral {@link CategoryList} entities.
 *
 * Notes:
 * - Relies on {@link fetchAndMapFromIGDB} for shared fetch/validate/map logic.
 * - Operates at the infrastructure level, exposing only domain-safe data.
 */
export const igdbCategoryAdapter = (authPort: AuthPort, apiUrl: string, clientId: string): CategoryPort => ({
  /**
   * Fetches and maps all genres from IGDB.
   *
   * @returns A {@link CategoryList} containing normalized genre entities.
   */
  getGenres: (): Promise<CategoryList> =>
    fetchAndMapFromIGDB(authPort, {
      apiUrl,
      clientId,
      endpoint: 'genres',
      query,
      schema: IGDBCategoryListSchema,
      mapper: (data) => data.map(toCategory),
      errorPath: path,
    }),

  /**
   * Fetches and maps all platforms from IGDB.
   *
   * @returns A {@link CategoryList} containing normalized platform entities.
   */
  getPlatforms: (): Promise<CategoryList> =>
    fetchAndMapFromIGDB(authPort, {
      apiUrl,
      clientId,
      endpoint: 'platforms',
      query,
      schema: IGDBCategoryListSchema,
      mapper: (data) => data.map(toCategory),
      errorPath: path,
    }),

  /**
   * Fetches and maps all themes from IGDB.
   *
   * @returns A {@link CategoryList} containing normalized theme entities.
   */
  getThemes: (): Promise<CategoryList> =>
    fetchAndMapFromIGDB(authPort, {
      apiUrl,
      clientId,
      endpoint: 'themes',
      query,
      schema: IGDBCategoryListSchema,
      mapper: (data) => data.map(toCategory),
      errorPath: path,
    }),
})
