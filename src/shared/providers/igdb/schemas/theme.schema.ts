import { z } from 'zod'
import { IGDBNamedResourceSchema } from './common.schema.ts'

export const IGDBThemeSchema = IGDBNamedResourceSchema
export const IGDBThemeListSchema = z.array(IGDBThemeSchema)
