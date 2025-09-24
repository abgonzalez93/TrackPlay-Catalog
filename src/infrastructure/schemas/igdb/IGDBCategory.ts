import { z } from 'zod'

/**
 * Schema for IGDB category items such as genres, platforms, or themes.
 */
export const IGDBCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
})

/**
 * Schema for a list of category items.
 */
export const IGDBCategoryListSchema = z.array(IGDBCategorySchema)

export type IGDBCategory = z.infer<typeof IGDBCategorySchema>
export type IGDBCategoryList = z.infer<typeof IGDBCategoryListSchema>
