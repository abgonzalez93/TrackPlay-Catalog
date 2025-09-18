import { IGDBIdSchema } from './IGDBId'
import { z } from 'zod'

const IGDBIdArray = z.array(IGDBIdSchema)
const UnixTimestamp = z.number().int().nonnegative()

/**
 * Zod schema for validating a raw IGDB game entity.
 *
 * This schema mirrors the structure of the IGDB `/games` endpoint response.
 * It validates both relationships (e.g. `genres`, `platforms`, `themes`) as arrays of IGDB IDs,
 * and scalar fields such as ratings, release dates, and textual data.
 *
 * Notes:
 * - Most relational fields are optional and nullable arrays of IDs (`IGDBIdArray`).
 * - Timestamps are expressed as Unix epoch seconds (`UnixTimestamp`).
 * - Ratings and counts may be `null` if no data is available.
 * - Textual fields (`summary`, `storyline`, etc.) are optional and may be `null`.
 *
 */
export const IGDBGameSchema = z.object({
  id: IGDBIdSchema,
  age_ratings: IGDBIdArray.optional().nullable(),
  alternative_names: IGDBIdArray.optional().nullable(),
  artworks: IGDBIdArray.optional().nullable(),
  bundles: IGDBIdArray.optional().nullable(),
  collections: IGDBIdArray.optional().nullable(),
  cover: IGDBIdSchema.optional().nullable(),
  dlcs: IGDBIdArray.optional().nullable(),
  expanded_games: IGDBIdArray.optional().nullable(),
  expansions: IGDBIdArray.optional().nullable(),
  external_games: IGDBIdArray.optional().nullable(),
  forks: IGDBIdArray.optional().nullable(),
  franchise: IGDBIdSchema.optional().nullable(),
  franchises: IGDBIdArray.optional().nullable(),
  game_engines: IGDBIdArray.optional().nullable(),
  game_localizations: IGDBIdArray.optional().nullable(),
  game_modes: IGDBIdArray.optional().nullable(),
  game_status: IGDBIdSchema.optional().nullable(),
  game_type: IGDBIdSchema.optional().nullable(),
  genres: IGDBIdArray.optional().nullable(),
  involved_companies: IGDBIdArray.optional().nullable(),
  keywords: IGDBIdArray.optional().nullable(),
  language_supports: IGDBIdArray.optional().nullable(),
  multiplayer_modes: IGDBIdArray.optional().nullable(),
  parent_game: IGDBIdSchema.optional().nullable(),
  platforms: IGDBIdArray.optional().nullable(),
  player_perspectives: IGDBIdArray.optional().nullable(),
  ports: IGDBIdArray.optional().nullable(),
  release_dates: IGDBIdArray.optional().nullable(),
  remakes: IGDBIdArray.optional().nullable(),
  remasters: IGDBIdArray.optional().nullable(),
  screenshots: IGDBIdArray.optional().nullable(),
  similar_games: IGDBIdArray.optional().nullable(),
  standalone_expansions: IGDBIdArray.optional().nullable(),
  themes: IGDBIdArray.optional().nullable(),
  videos: IGDBIdArray.optional().nullable(),
  websites: IGDBIdArray.optional().nullable(),
  version_parent: IGDBIdSchema.optional().nullable(),
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
