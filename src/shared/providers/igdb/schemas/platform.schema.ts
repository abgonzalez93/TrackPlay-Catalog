import { z } from 'zod'
import { IGDBNamedResourceSchema, IGDBImageSchema } from './common.schema.ts'

export const IGDBPlatformSchema = IGDBNamedResourceSchema.extend({
  abbreviation: z.string().optional(),
  platform_logo: IGDBImageSchema.optional(),
})

export const IGDBPlatformListSchema = z.array(IGDBPlatformSchema)
