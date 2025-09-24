import { GameFilters } from '@trackplay/core/schemas'
import { IGDBGameFilters } from '@schemas/index'
import { GAME } from '@trackplay/core/constants'

type SortFields = (typeof GAME.GAME_SORT_FIELDS)[number]
/**
 * Maps a neutral backend sort field into an IGDB-specific sort field.
 *
 * Responsibilities:
 * - Converts domain-level sort keys (`title`, `releaseDate`, `rating`)
 *   into IGDB-compatible keys (`name`, `first_release_date`, `rating`).
 *
 * @param sortBy - Neutral sort field defined at the domain level.
 * @returns {IGDBGameFilters['sortBy']} The IGDB-compatible sort field,
 * or `undefined` if no mapping is available.
 *
 */
const mapSortField = (sortBy?: SortFields): IGDBGameFilters['sortBy'] => {
  switch (sortBy) {
    case 'title':
      return 'name'
    case 'releaseDate':
      return 'first_release_date'
    case 'rating':
      return 'rating'
    default:
      return undefined
  }
}

/**
 * Transforms domain-neutral {@link GameFilters} into IGDB-specific filters.
 *
 * Responsibilities:
 * - Maps domain filter fields (`query`, `limit`, `offset`, `sortBy`, `sortOrder`, `minRating`)
 *   into their IGDB-compatible counterparts.
 * - Converts sort fields using {@link mapSortField}.
 * - Category filters (`genres`, `platforms`, `themes`) are left as `undefined`
 *   until domain-to-IGDB mappings are implemented.
 *
 * Notes:
 * - This function isolates IGDB's query format from the rest of the application,
 *   allowing the domain to remain provider-agnostic.
 *
 * @param entity - Neutral filters defined at the domain level.
 * @returns {IGDBGameFilters} A filter object in IGDB-compatible format.
 *
 */
export const toIGDBFilters = (entity: GameFilters): IGDBGameFilters => {
  return {
    q: entity.query,
    limit: entity.limit,
    offset: entity.offset,
    sortBy: mapSortField(entity.sortBy),
    sortOrder: entity.sortOrder,

    minRating: entity.minRating,

    genres: undefined,
    platforms: undefined,
    themes: undefined,
  }
}
