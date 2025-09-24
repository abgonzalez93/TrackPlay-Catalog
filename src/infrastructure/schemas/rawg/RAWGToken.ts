import z from 'zod'

/**
 * Schema for the API key response from RAWG.
 */
export const RAWGTokenSchema = z.object({
  apiKey: z.string(),
})

export type RAWGToken = z.infer<typeof RAWGTokenSchema>
