import { IGDBGameFilters } from '@schemas/index'
import { IGDB } from '@constants/index'

/**
 * Extended set of IGDB query builder options.
 *
 * Merges normalized {@link IGDBGameFilters} with optional low-level `where` clauses,
 * allowing adapters to inject both structured filters and raw IGQL conditions.
 */
export type BuildQueryOptions = IGDBGameFilters & {
  /** Optional raw `where` condition string that overrides auto-generated filters. */
  where?: string
}

/**
 * Escapes double quotes (`"`) in a string value to ensure it does not
 * break the IGDB query syntax.
 *
 * ### Example
 * ```ts
 * escapeDoubleQuotes('Need "for" Speed') // -> 'Need \"for\" Speed'
 * ```
 *
 * @param val - Input string that may contain double quotes.
 * @returns The escaped string safe for IGDB query inclusion.
 */
const escapeDoubleQuotes = (val: string): string => val.replace(/"/g, '\\"')

/**
 * **IGDB Query Builder**
 *
 * Generates an IGDB-compatible query string from domain-level
 * or provider-specific filter options.
 *
 * This utility defines **how** normalized filter objects are
 * translated into the **IGDB Query Language (IGQL)** format.
 *
 * ### Responsibilities
 * - Convert normalized filter objects into structured IGQL clauses.
 * - Escape user-provided values using {@link escapeDoubleQuotes}.
 * - Dynamically assemble `fields`, `search`, `where`, `sort`, `limit`, and `offset` clauses.
 * - Support both structured filters and raw `where` overrides.
 *
 * ### Supported Filters
 * - **Search term** (`q`)
 * - **Threshold filters** (`minRating`, `minAggregatedRating`, `minFollows`, `minHypes`)
 * - **Category filters** (`platforms`, `genres`, `themes`)
 * - **Sorting** (`sortBy`, `sortOrder`)
 * - **Pagination** (`limit`, `offset`)
 * - **Advanced conditions** (`filters`, `where`)
 *
 * ### Notes
 * - If both `where` and normalized filters are provided, the explicit `where` string takes precedence.
 * - Default values:
 *   - `limit`: `5`
 *   - `sortOrder`: `"desc"`
 * - All string literals are escaped to prevent malformed queries.
 * - Uses the predefined field set from {@link IGDB.GAME_FIELDS}.
 *
 * @param filters - The filtering, sorting, and pagination options to build into an IGDB query.
 * @returns A fully assembled and IGQL-compliant query string.
 *
 */
export const buildIGDBQuery = (filters: BuildQueryOptions): string => {
  const {
    q,
    limit = 5,
    offset = 0,
    sortBy,
    sortOrder = 'desc',
    minRating,
    minAggregatedRating,
    minFollows,
    minHypes,
    platforms,
    genres,
    themes,
    filters: advancedFilters,
    where,
  } = filters

  const whereParts: string[] = []

  const normalizedFilters = [
    ...(minRating !== undefined ? [{ field: 'rating', operator: '>=', value: minRating }] : []),
    ...(minAggregatedRating !== undefined
      ? [{ field: 'aggregated_rating', operator: '>=', value: minAggregatedRating }]
      : []),
    ...(minFollows !== undefined ? [{ field: 'follows', operator: '>=', value: minFollows }] : []),
    ...(minHypes !== undefined ? [{ field: 'hypes', operator: '>=', value: minHypes }] : []),
    ...(platforms?.length ? [{ field: 'platforms', operator: '=', value: platforms }] : []),
    ...(genres?.length ? [{ field: 'genres', operator: '=', value: genres }] : []),
    ...(themes?.length ? [{ field: 'themes', operator: '=', value: themes }] : []),
    ...(advancedFilters ?? []),
  ]

  normalizedFilters.forEach(({ field, operator, value }) => {
    if (Array.isArray(value)) {
      whereParts.push(`${field} ${operator} (${value.join(',')})`)
    } else if (typeof value === 'string') {
      whereParts.push(`${field} ${operator} "${escapeDoubleQuotes(value)}"`)
    } else {
      whereParts.push(`${field} ${operator} ${value}`)
    }
  })

  return [
    `fields ${IGDB.GAME_FIELDS.trim()};`,
    q ? `search "${escapeDoubleQuotes(q)}";` : '',
    where ? `where ${where};` : whereParts.length ? `where ${whereParts.join(' & ')};` : '',
    sortBy ? `sort ${sortBy} ${sortOrder};` : '',
    `limit ${limit};`,
    `offset ${offset};`,
  ]
    .filter(Boolean)
    .join('\n')
}
