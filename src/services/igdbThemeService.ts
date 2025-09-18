import { IGDBCategoryList, IGDBCategoryListSchema } from '@schemas/index'
import { BadRequestError, TrackPlayError } from '@trackplay/core/errors'
import { validateSchema } from '@trackplay/core/utils'
import { igdbClient } from '@clients/index'

const path = 'igdb.services.igdbThemeService'

/**
 * IGDB Theme Service.
 *
 * Provides high-level operations for interacting with the IGDB `themes` endpoint.
 * Allows fetching the complete list of available game themes from IGDB.
 */
export const igdbThemeService = {
  /**
   * Retrieves all available themes from the IGDB API.
   *
   * Internally calls the IGDB `themes` endpoint with a predefined set of fields
   * (`id`, `name`, `slug`) to return a lightweight, structured list.
   *
   * @returns A validated list of IGDB theme objects, each containing `id`, `name`, and `slug`.
   * @throws BadRequestError - If the API request fails or the response cannot be parsed.
   * @throws TrackPlayError - If a domain-level error occurs upstream.
   */
  getAll: async (): Promise<IGDBCategoryList> => {
    try {
      const data = await igdbClient.request<unknown>('themes', 'fields id,name,slug;')
      return validateSchema(IGDBCategoryListSchema, data, `${path}.themes_invalid_format`)
    } catch (error: unknown) {
      if (error instanceof TrackPlayError) throw error
      throw new BadRequestError(`${path}.themes_fetch_failed`, error)
    }
  },
}
