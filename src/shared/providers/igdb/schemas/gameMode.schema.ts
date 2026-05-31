import { z } from 'zod'
import { IGDBNamedResourceSchema } from './common.schema.ts'

export const IGDBGameModeSchema = IGDBNamedResourceSchema
export const IGDBGameModeListSchema = z.array(IGDBGameModeSchema)
