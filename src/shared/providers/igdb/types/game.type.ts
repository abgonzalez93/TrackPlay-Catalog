import { z } from 'zod'
import {
  IGDBAgeRatingSchema,
  IGDBExternalGameSchema,
  IGDBGameBaseSchema,
  IGDBGameEngineSchema,
  IGDBGameTypeSchema,
} from '#igdbSchemas/game.schema'

export type IGDBGame = z.infer<typeof IGDBGameBaseSchema> & {
  parent_game?: IGDBGame | undefined
  dlcs?: IGDBGame[] | undefined
  expansions?: IGDBGame[] | undefined
  remakes?: IGDBGame[] | undefined
  remasters?: IGDBGame[] | undefined
  similar_games?: IGDBGame[] | undefined
}

export type IGDBGameType = z.infer<typeof IGDBGameTypeSchema>
export type IGDBGameEngine = z.infer<typeof IGDBGameEngineSchema>
export type IGDBExternalGame = z.infer<typeof IGDBExternalGameSchema>
export type IGDBAgeRating = z.infer<typeof IGDBAgeRatingSchema>
