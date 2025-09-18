import { IGDBCategoryList, IGDBCategoryListSchema } from '@schemas/index'
import { BadRequestError, TrackPlayError } from '@trackplay/core/errors'
import { validateSchema } from '@trackplay/core/utils'
import { igdbClient } from '@clients/index'

const path = 'igdb.services.igdbGenreService'

/**
 * IGDB Genre Service.
 *
 * Provides high-level operations for interacting with the IGDB `genres` endpoint.
 * Allows fetching the complete list of available game genres from IGDB.
 */
export const igdbGenreService = {
  /**
   * Retrieves all available genres from the IGDB API.
   *
   * Internally calls the IGDB `genres` endpoint with a predefined set of fields
   * (`id`, `name`, `slug`) to return a lightweight, structured list.
   *
   * @returns An array of IGDB genre objects, each containing `id`, `name`, and `slug`.
   * @throws BadRequestError - If the API request fails or the response cannot be parsed.
   * @throws TrackPlayError - If a domain-level error occurs upstream.
   */
  getAll: async (): Promise<IGDBCategoryList> => {
    try {
      const data = await igdbClient.request<unknown>('genres', 'fields id,name,slug;')
      return validateSchema(IGDBCategoryListSchema, data, `${path}.genres_invalid_format`)
    } catch (error: unknown) {
      if (error instanceof TrackPlayError) throw error
      throw new BadRequestError(`${path}.genres_fetch_failed`, error)
    }
  },
}
