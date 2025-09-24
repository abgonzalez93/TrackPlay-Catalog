import z from 'zod'

/**
 * Schema for the OAuth token response from IGDB/Twitch.
 */
export const IGDBTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
})

export type IGDBToken = z.infer<typeof IGDBTokenSchema>
