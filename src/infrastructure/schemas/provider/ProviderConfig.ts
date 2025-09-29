import { IGDBConfigSchema } from '@schemas/igdb'
import { RAWGConfigSchema } from '@schemas/rawg'
import { z } from 'zod'

/**
 * Union schema for supported providers (IGDB | RAWG).
 */
export const ProviderConfigSchema = z.union([IGDBConfigSchema, RAWGConfigSchema])

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>
