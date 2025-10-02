import { ProviderTokenPort, CategoryPort } from '@trackplay/core/ports'
import { getTranslationPath } from '@trackplay/core/utils'
import { IGDBCategoryListSchema } from '@schemas/index'
import { CategoryList } from '@trackplay/core/schemas'
import { withIGDBConfig } from '../helpers/index'
import { toCategory } from '@mappers/index'

const path = getTranslationPath(import.meta.url)
const query = 'fields id,name,slug;'

/**
 * **IGDB Category Adapter**
 *
 * Infrastructure-level adapter that implements the {@link CategoryPort}
 * interface for retrieving and normalizing category data (genres, platforms,
 * and themes) from the IGDB API.
 *
 * This adapter defines **how** category-related data is fetched, validated,
 * and mapped into domain-neutral structures that can be safely consumed by
 * upper layers (services, use cases).
 *
 * ### Responsibilities
 * - Fetch category data (genres, platforms, themes) from the IGDB API.
 * - Validate raw responses using {@link IGDBCategoryListSchema}.
 * - Map validated entities into domain-safe {@link CategoryList} objects via {@link toCategory}.
 * - Encapsulate provider-specific details, exposing a unified contract to the domain.
 *
 * ### Notes
 * - Relies on {@link withIGDBConfig} for shared fetch/validate/map orchestration.
 * - Operates purely at the infrastructure level — no domain or caching logic.
 * - Should be instantiated through the dependency container with valid credentials.
 *
 * @param authPort - The {@link ProviderTokenPort} used to retrieve and inject a valid IGDB access token.
 * @param apiUrl - The IGDB API base URL.
 * @param clientId - The IGDB client identifier.
 * @returns An implementation of the {@link CategoryPort} interface for IGDB.
 */
export const igdbCategoryAdapter = (authPort: ProviderTokenPort, apiUrl: string, clientId: string): CategoryPort => {
  const igdb = withIGDBConfig(authPort, apiUrl, clientId, path)

  /**
   * Fetches and maps all available game genres from IGDB.
   *
   * @returns A {@link CategoryList} containing normalized genre entities.
   *
   * @throws {Error} If the IGDB API request fails or response validation fails.
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
   * Fetches and maps all available game platforms from IGDB.
   *
   * @returns A {@link CategoryList} containing normalized platform entities.
   *
   * @throws {Error} If the IGDB API request fails or response validation fails.
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
   * Fetches and maps all available game themes from IGDB.
   *
   * @returns A {@link CategoryList} containing normalized theme entities.
   *
   * @throws {Error} If the IGDB API request fails or response validation fails.
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
