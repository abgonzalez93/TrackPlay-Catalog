import { IdSchema } from '@trackplay/core'
import { z } from 'zod'
import { IGDBImageSchema, IGDBNamedResourceSchema, IGDBVideoSchema, IGDBWebsiteSchema } from './common.schema.ts'
import { IGDBInvolvedCompanySchema } from './company.schema.ts'
import { IGDBGenreSchema } from './genre.schema.ts'
import { IGDBPlatformSchema } from './platform.schema.ts'
import type { IGDBGame } from '#igdbTypes/game.type'

const IGDBAgeRatingContentDescriptionSchema = z.object({
  id: IdSchema,
  description: z.string(),
})

export const IGDBAgeRatingSchema = z.object({
  id: IdSchema,
  organization: z.object({ name: z.string() }).optional(),
  rating_category: z.object({ rating: z.string() }).optional(),
  content_descriptions: z.array(IGDBAgeRatingContentDescriptionSchema).optional(),
})

export const IGDBExternalGameSchema = z.object({
  id: IdSchema,
  category: z.number().int().optional(),
  uid: z.string().optional(),
  url: z.url().optional(),
})

export const IGDBGameEngineSchema = IGDBNamedResourceSchema.extend({
  logo: IGDBImageSchema.optional(),
})

export const IGDBGameTypeSchema = z.object({
  id: IdSchema,
  type: z.string().optional(),
})

export const IGDBGameBaseSchema = IGDBNamedResourceSchema.extend({
  cover: IGDBImageSchema.optional(),
  screenshots: z.array(IGDBImageSchema).optional(),
  artworks: z.array(IGDBImageSchema).optional(),
  videos: z.array(IGDBVideoSchema).optional(),

  websites: z.array(IGDBWebsiteSchema).optional(),
  external_games: z.array(IGDBExternalGameSchema).optional(),

  age_ratings: z.array(IGDBAgeRatingSchema).optional(),
  game_engines: z.array(IGDBGameEngineSchema).optional(),
  player_perspectives: z.array(IGDBNamedResourceSchema).optional(),
  collection: IGDBNamedResourceSchema.optional(),

  first_release_date: z.number().int().nonnegative().optional(),
  total_rating: z.number().optional(),

  summary: z.string().optional(),
  storyline: z.string().optional(),

  game_type: IGDBGameTypeSchema.optional(),
  genres: z.array(IGDBGenreSchema).optional(),
  themes: z.array(IGDBNamedResourceSchema).optional(),
  game_modes: z.array(IGDBNamedResourceSchema).optional(),
  platforms: z.array(IGDBPlatformSchema).optional(),

  involved_companies: z.array(IGDBInvolvedCompanySchema).optional(),
})

export const IGDBGameSchema: z.ZodType<IGDBGame> = IGDBGameBaseSchema.extend({
  parent_game: z.lazy(() => IGDBGameSchema.optional()),
  dlcs: z.lazy(() => z.array(IGDBGameSchema).optional()),
  expansions: z.lazy(() => z.array(IGDBGameSchema).optional()),
  remakes: z.lazy(() => z.array(IGDBGameSchema).optional()),
  remasters: z.lazy(() => z.array(IGDBGameSchema).optional()),
  similar_games: z.lazy(() => z.array(IGDBGameSchema).optional()),
})

export const IGDBGameListSchema = z.array(IGDBGameSchema)
