import { IdSchema, IdListSchema } from '@trackplay/core/schemas'
import { z } from 'zod'

const UnixTimestamp = z.number().int().nonnegative()

/**
 * Zod schema for validating a raw IGDB game entity.
 *
 * This schema mirrors the structure of the IGDB `/games` endpoint response.
 * It validates both relationships (e.g. `genres`, `platforms`, `themes`) as arrays of IGDB IDs,
 * and scalar fields such as ratings, release dates, and textual data.
 *
 * Notes:
 * - Most relational fields are optional and nullable arrays of IDs (`IdListSchema`).
 * - Timestamps are expressed as Unix epoch seconds (`UnixTimestamp`).
 * - Ratings and counts may be `null` if no data is available.
 * - Textual fields (`summary`, `storyline`, etc.) are optional and may be `null`.
 *
 */
export const IGDBGameSchema = z.object({
  id: IdSchema,
  age_ratings: IdListSchema.optional().nullable(),
  alternative_names: IdListSchema.optional().nullable(),
  artworks: IdListSchema.optional().nullable(),
  bundles: IdListSchema.optional().nullable(),
  collections: IdListSchema.optional().nullable(),
  cover: IdSchema.optional().nullable(),
  dlcs: IdListSchema.optional().nullable(),
  expanded_games: IdListSchema.optional().nullable(),
  expansions: IdListSchema.optional().nullable(),
  external_games: IdListSchema.optional().nullable(),
  forks: IdListSchema.optional().nullable(),
  franchise: IdSchema.optional().nullable(),
  franchises: IdListSchema.optional().nullable(),
  game_engines: IdListSchema.optional().nullable(),
  game_localizations: IdListSchema.optional().nullable(),
  game_modes: IdListSchema.optional().nullable(),
  game_status: IdSchema.optional().nullable(),
  game_type: IdSchema.optional().nullable(),
  genres: IdListSchema.optional().nullable(),
  involved_companies: IdListSchema.optional().nullable(),
  keywords: IdListSchema.optional().nullable(),
  language_supports: IdListSchema.optional().nullable(),
  multiplayer_modes: IdListSchema.optional().nullable(),
  parent_game: IdSchema.optional().nullable(),
  platforms: IdListSchema.optional().nullable(),
  player_perspectives: IdListSchema.optional().nullable(),
  ports: IdListSchema.optional().nullable(),
  release_dates: IdListSchema.optional().nullable(),
  remakes: IdListSchema.optional().nullable(),
  remasters: IdListSchema.optional().nullable(),
  screenshots: IdListSchema.optional().nullable(),
  similar_games: IdListSchema.optional().nullable(),
  standalone_expansions: IdListSchema.optional().nullable(),
  themes: IdListSchema.optional().nullable(),
  videos: IdListSchema.optional().nullable(),
  websites: IdListSchema.optional().nullable(),
  version_parent: IdSchema.optional().nullable(),
  aggregated_rating: z.number().nullable().optional(),
  aggregated_rating_count: z.number().int().nullable().optional(),
  first_release_date: UnixTimestamp.nullable().optional(),
  hypes: z.number().int().nullable().optional(),
  rating: z.number().nullable().optional(),
  rating_count: z.number().int().nullable().optional(),
  total_rating: z.number().nullable().optional(),
  total_rating_count: z.number().int().nullable().optional(),
  tags: z.array(z.number().int()).nullable().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  storyline: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  url: z.url().nullable().optional(),
  version_title: z.string().nullable().optional(),
  created_at: UnixTimestamp.optional(),
  updated_at: UnixTimestamp.optional(),
  checksum: z.uuid().optional(),
})

/**
 * Schema for a list of games.
 */
export const IGDBGameListSchema = z.array(IGDBGameSchema)

export type IGDBGame = z.infer<typeof IGDBGameSchema>
export type IGDBGameList = z.infer<typeof IGDBGameListSchema>
