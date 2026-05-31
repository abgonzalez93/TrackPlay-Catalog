import { z } from 'zod'
import { IGDBPlatformSchema } from '#igdbSchemas/platform.schema'

export type IGDBPlatform = z.infer<typeof IGDBPlatformSchema>
