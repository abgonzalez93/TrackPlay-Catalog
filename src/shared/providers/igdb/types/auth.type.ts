import { z } from 'zod'
import { IGDBConfigSchema, IGDBTokenSchema } from '#igdbSchemas/auth.schema'

export type IGDBToken = z.infer<typeof IGDBTokenSchema>
export type IGDBConfig = z.infer<typeof IGDBConfigSchema>
