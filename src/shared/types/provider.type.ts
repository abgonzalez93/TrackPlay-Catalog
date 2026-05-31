import { z } from 'zod'
import { IGDBConfigSchema } from '#igdbSchemas/auth.schema'
import { GameProviderSchema } from '#schemas/config.schema'
import { ProviderConfigSchema, ProviderTokenSchema } from '#schemas/provider.schema'

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>
export type ProviderToken = z.infer<typeof ProviderTokenSchema>
export type ProviderType = z.infer<typeof GameProviderSchema>
export type IGDBProviderConfig = z.infer<typeof IGDBConfigSchema>
