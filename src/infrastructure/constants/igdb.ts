/**
 * **IGDB Constant**
 *
 * Defines reusable constants for building IGDB game queries.
 *
 * ### Scope
 * - Provides default `fields` selections for IGDB queries.
 * - Exposes available sorting keys used in {@link buildIGDBQuery}.
 *
 * ### Notes
 * - The `GAME_FIELDS` string lists all IGDB fields to be requested when
 *   fetching game data, including nested relations (e.g., cover, genres, platforms).
 * - The `GAME_SORT_FIELDS` array enumerates sortable fields supported by IGDB.
 *
 * @see {@link buildIGDBQuery}
 * @see {@link igdbGameAdapter}
 */
export const IGDB = {
  /**
   * Default field selection for IGDB game queries.
   * Includes top-level and nested fields such as cover, genres, and platforms.
   */
  GAME_FIELDS: `
    id, name, slug, summary, first_release_date, rating, aggregated_rating,
    follows, hypes, cover.url, genres.name, platforms.name,
    screenshots.url, videos.video_id, similar_games, url
  `,

  /**
   * List of supported sort fields for IGDB game queries.
   * Can be used to build dynamic sorting expressions.
   */
  GAME_SORT_FIELDS: ['name', 'rating', 'first_release_date', 'aggregated_rating', 'follows', 'hypes'] as const,
}
