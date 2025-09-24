import { IGDBGameFilters } from '@schemas/index'
import { IGDB } from '@constants/index'

export type BuildQueryOptions = IGDBGameFilters & {
  where?: string
}

/**
 * Escapes double quotes in a string to ensure it does not break queries.
 *
 * @param val - The input string that may contain double quotes.
 * @returns The string with all double quotes escaped.
 */
const escapeDoubleQuotes = (val: string): string => val.replace(/"/g, '\\"')

/**
 * Builds an IGDB-compatible query string from normalized filter options.
 *
 * Responsibilities:
 * - Converts domain-neutral or IGDB filter fields into a query string
 *   following IGDB's query language format.
 * - Escapes user-provided values (e.g. search terms, string filters) to prevent
 *   malformed queries.
 * - Dynamically assembles `fields`, `search`, `where`, `sort`, `limit`, and
 *   `offset` clauses based on the provided filters.
 *
 * Supported filters include:
 * - Search term (`q`)
 * - Minimum thresholds (`minRating`, `minAggregatedRating`, `minFollows`, `minHypes`)
 * - Category-based filters (`platforms`, `genres`, `themes`)
 * - Sorting (`sortBy`, `sortOrder`)
 * - Pagination (`limit`, `offset`)
 * - Advanced custom conditions (`filters`, `where`)
 *
 * Notes:
 * - If both `where` and normalized filters exist, the explicit `where` string
 *   takes precedence.
 * - Default `limit` is 5 and `sortOrder` is `"desc"`.
 * - Escaping is handled by {@link escapeDoubleQuotes}.
 *
 * @param filters - The filtering, sorting, and pagination options
 *                  to build into an IGDB query.
 * @returns {string} A fully assembled query string compatible with the IGDB API.
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
