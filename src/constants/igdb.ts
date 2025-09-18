/**
 * All available fields for an IGDB Game query, expanded for nested objects like cover, genres, etc.
 */
export const IGDB = {
  MAX_GAME_LIMIT: 50,
  GAME_FIELDS: `
    id, name, slug, summary, first_release_date, rating, aggregated_rating,
    follows, hypes, cover.url, genres.name, platforms.name,
    screenshots.url, videos.video_id, similar_games, url
  `,
  GAME_SORT_FIELDS: ['name', 'rating', 'first_release_date', 'aggregated_rating', 'follows', 'hypes'] as const,
}
