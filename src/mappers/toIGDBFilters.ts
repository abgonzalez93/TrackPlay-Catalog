import { GameFilters } from '@trackplay/core/schemas'
import { IGDBGameFilters } from '@schemas/index'
import { GAME } from '@trackplay/core/constants'

type SortFields = (typeof GAME.GAME_SORT_FIELDS)[number]

/**
 * Maps neutral backend sort fields into IGDB-specific sort fields.
 *
 * @param sortBy - Neutral sort field (`title`, `releaseDate`, `rating`)
 * @returns IGDB sort field (`name`, `first_release_date`, `rating`) or undefined if none
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
 * Transforms neutral backend filters (`GameFilters`) into IGDB-specific filters (`IGDBGameFilters`).
 *
 * - Maps neutral `query`, `limit`, `offset`, `sortBy`, `sortOrder`, `minRating`.
 * - Category filters (`genres`, `platforms`, `themes`) are left undefined until mappings are implemented.
 *
 * @param entity - Neutral game filters
 * @returns Filters in IGDB-compatible format
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
