import { PositiveNumberSchema } from '@trackplay/core/schemas'
import { GAME } from '@trackplay/core/constants'
import { IGDB } from '@constants/index'
import { z } from 'zod'

/**
 * Schema for IGDB game filtering, sorting and pagination options.
 * Accepts query params as strings and converts them to numbers automatically.
 */
export const IGDBGameFiltersSchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().min(1).max(GAME.MAX_GAME_LIMIT).optional(),
  offset: z.coerce.number().min(0).optional(),
  sortBy: z.enum(IGDB.GAME_SORT_FIELDS).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),

  minRating: z.coerce.number().min(0).max(100).optional(),
  minAggregatedRating: z.coerce.number().min(0).max(100).optional(),
  minFollows: z.coerce.number().min(0).optional(),
  minHypes: z.coerce.number().min(0).optional(),

  genres: z.array(PositiveNumberSchema).optional(),
  platforms: z.array(PositiveNumberSchema).optional(),
  themes: z.array(PositiveNumberSchema).optional(),

  filters: z
    .array(
      z.object({
        field: z.string(),
        operator: z.string(),
        value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]),
      }),
    )
    .optional(),
})

export type IGDBGameFilters = z.infer<typeof IGDBGameFiltersSchema>
