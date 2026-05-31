import { z } from 'zod'
import { IGDBGameModeSchema } from '#igdbSchemas/gameMode.schema'

export type IGDBGameMode = z.infer<typeof IGDBGameModeSchema>
