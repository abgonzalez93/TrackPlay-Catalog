import { z } from 'zod'

/**
 * Schema for RAWG provider configuration.
 */
export const RAWGConfigSchema = z.object({
  type: z.literal('rawg'),
  apiUrl: z.url(),
  apiKey: z.string().min(1),
})

export type RAWGConfig = z.infer<typeof RAWGConfigSchema>
