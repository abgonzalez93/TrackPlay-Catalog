import { z } from 'zod'
import { IGDBNamedResourceSchema } from './common.schema.ts'

export const IGDBGenreSchema = IGDBNamedResourceSchema
export const IGDBGenreListSchema = z.array(IGDBGenreSchema)
