import { z } from 'zod'
import { IGDBNamedResourceSchema } from './common.schema.ts'

export const IGDBPlayerPerspectiveSchema = IGDBNamedResourceSchema
export const IGDBPlayerPerspectiveListSchema = z.array(IGDBPlayerPerspectiveSchema)
