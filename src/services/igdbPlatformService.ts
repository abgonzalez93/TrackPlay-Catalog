import { IGDBCategoryList, IGDBCategoryListSchema } from '@schemas/index'
import { BadRequestError, TrackPlayError } from '@trackplay/core/errors'
import { validateSchema } from '@trackplay/core/utils'
import { igdbClient } from '@clients/index'

const path = 'igdb.services.igdbPlatformService'

/**
 * IGDB Platform Service.
 *
 * Provides high-level operations for interacting with the IGDB `platforms` endpoint.
 * Allows fetching the complete list of available game platforms from IGDB.
 */
export const igdbPlatformService = {
  /**
   * Retrieves all available platforms from the IGDB API.
   *
   * Internally calls the IGDB `platforms` endpoint with a predefined set of fields
   * (`id`, `name`, `slug`) to return a lightweight, structured list.
   *
   * @returns A validated list of IGDB platform objects, each containing `id`, `name`, and `slug`.
   * @throws BadRequestError - If the API request fails or the response cannot be parsed.
   * @throws TrackPlayError - If a domain-level error occurs upstream.
   */
  getAll: async (): Promise<IGDBCategoryList> => {
    try {
      const data = await igdbClient.request<unknown>('platform_types', 'fields id,name,slug;')
      return validateSchema(IGDBCategoryListSchema, data, `${path}.platforms_invalid_format`)
    } catch (error: unknown) {
      if (error instanceof TrackPlayError) throw error
      throw new BadRequestError(`${path}.platforms_fetch_failed`, error)
    }
  },
}
