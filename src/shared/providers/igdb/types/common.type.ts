import { z } from 'zod'
import { IGDBImageSchema, IGDBNamedResourceSchema, IGDBWebsiteSchema, IGDBVideoSchema } from '#igdbSchemas/common.schema'

export type IGDBNamedResource = z.infer<typeof IGDBNamedResourceSchema>
export type IGDBImage = z.infer<typeof IGDBImageSchema>
export type IGDBVideo = z.infer<typeof IGDBVideoSchema>
export type IGDBWebsite = z.infer<typeof IGDBWebsiteSchema>
