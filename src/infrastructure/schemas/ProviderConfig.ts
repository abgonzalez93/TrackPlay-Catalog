import { IGDBConfigSchema } from './igdb/IGDBConfig'
import { RAWGConfigSchema } from './rawg/RAWGConfig'
import { z } from 'zod'

/**
 * Union schema for supported providers (IGDB | RAWG).
 */
export const ProviderConfigSchema = z.union([IGDBConfigSchema, RAWGConfigSchema])

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>
