import { GameFilters } from '@trackplay/core/schemas'
import { IGDBGameFilters } from '@schemas/index'
import { GAME } from '@trackplay/core/constants'

type SortFields = (typeof GAME.GAME_SORT_FIELDS)[number]

/**
 * **mapSortField**
 *
 * Maps a neutral backend sort field into an IGDB-specific field name.
 *
 * ### Scope
 * - Translates domain-level sort keys (e.g., `"title"`, `"releaseDate"`) into
 *   IGDB-compatible field identifiers.
 *
 * ### Notes
 * - Returns `undefined` when no explicit mapping exists, allowing the adapter
 *   to skip the sort clause.
 *
 * @param sortBy - Domain-level sort field name.
 * @returns The corresponding IGDB sort field, or `undefined` if not mapped.
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
 * **toIGDBFilters**
 *
 * Transforms a domain-neutral {@link GameFilters} object into an IGDB-compatible
 * {@link IGDBGameFilters} query configuration.
 *
 * ### Scope
 * - Acts as a **provider translation layer**, isolating IGDB query syntax from
 *   domain-level logic.
 * - Ensures that adapters interact only with normalized provider-specific formats.
 *
 * ### Mapping
 * - `query` → `q`
 * - `sortBy` → Mapped using {@link mapSortField}
 * - `sortOrder`, `limit`, `offset`, `minRating` → Passed through unchanged
 * - `genres`, `platforms`, `themes` → Left `undefined` until category mapping is implemented
 *
 * ### Notes
 * - Keeps IGDB-specific field names hidden from higher layers.
 * - Allows easy extension when adding new domain filters.
 *
 * @param entity - Domain-level filters from the application.
 * @returns An {@link IGDBGameFilters} object compatible with IGDB queries.
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
