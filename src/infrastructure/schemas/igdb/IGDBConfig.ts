import { z } from 'zod'

/**
 * Schema for IGDB provider configuration.
 */
export const IGDBConfigSchema = z.object({
  type: z.literal('igdb'),
  tokenUrl: z.string().url(),
  apiUrl: z.string().url(),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
})

export type IGDBConfig = z.infer<typeof IGDBConfigSchema>
