import { AuthPort, CategoryPort } from '@trackplay/core/ports'
import { getTranslationPath } from '@trackplay/core/utils'
import { IGDBCategoryListSchema } from '@schemas/index'
import { CategoryList } from '@trackplay/core/schemas'
import { withIGDBConfig } from '../helpers/index'
import { toCategory } from '@mappers/index'

const path = getTranslationPath(import.meta.url)
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
export const igdbCategoryAdapter = (authPort: AuthPort, apiUrl: string, clientId: string): CategoryPort => {
  const igdb = withIGDBConfig(authPort, apiUrl, clientId, path)

  /**
   * Fetches and maps all genres from IGDB.
   *
   * @returns A {@link CategoryList} containing normalized genre entities.
   */
  const getGenres = async (): Promise<CategoryList> => {
    return await igdb({
      endpoint: 'genres',
      query,
      schema: IGDBCategoryListSchema,
      mapper: (genres) => genres.map(toCategory),
    })
  }
  /**
   * Fetches and maps all platforms from IGDB.
   *
   * @returns A {@link CategoryList} containing normalized platform entities.
   */
  const getPlatforms = async (): Promise<CategoryList> => {
    return await igdb({
      endpoint: 'platforms',
      query,
      schema: IGDBCategoryListSchema,
      mapper: (platforms) => platforms.map(toCategory),
    })
  }

  /**
   * Fetches and maps all themes from IGDB.
   *
   * @returns A {@link CategoryList} containing normalized theme entities.
   */
  const getThemes = async (): Promise<CategoryList> => {
    return await igdb({
      endpoint: 'themes',
      query,
      schema: IGDBCategoryListSchema,
      mapper: (themes) => themes.map(toCategory),
    })
  }

  return {
    getGenres,
    getPlatforms,
    getThemes,
  }
}
