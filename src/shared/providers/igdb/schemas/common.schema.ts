import { IdSchema } from '@trackplay/core'
import { z } from 'zod'

export const IGDBNamedResourceSchema = z.object({
  id: IdSchema,
  name: z.string().optional(),
  slug: z.string().optional(),
})

export const IGDBImageSchema = z.object({
  id: IdSchema,
  url: z.string().optional(),
})

export const IGDBVideoSchema = z.object({
  id: IdSchema,
  name: z.string().optional(),
  video_id: z.string(),
})

export const IGDBWebsiteSchema = z.object({
  id: IdSchema,
  category: z.number().int().optional(),
  trusted: z.boolean().optional(),
  url: z.string().optional(),
})
