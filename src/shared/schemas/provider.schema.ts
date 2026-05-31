import { z } from 'zod'
import { IGDBConfigSchema } from '#igdbSchemas/auth.schema'

export const ProviderConfigSchema = IGDBConfigSchema

export const ProviderTokenSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('bearer'),
    token: z.string(),
    expiresAt: z.number().int().nonnegative(),
  }),
  z.object({
    type: z.literal('apiKey'),
    token: z.string(),
    expiresAt: z.null(),
  }),
])
