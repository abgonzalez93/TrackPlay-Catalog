import { z } from 'zod'

export const IGDBTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
})

export const IGDBConfigSchema = z.object({
  type: z.literal('igdb'),
  tokenUrl: z.url(),
  apiUrl: z.url(),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
})
