import { z } from 'zod'

/**
 * Schema for IGDB category items such as genres, platforms, or themes.
 */
export const IGDBCategoryItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
})

/**
 * Schema for a list of category items.
 */
export const IGDBCategoryListSchema = z.array(IGDBCategoryItemSchema)

export type IGDBCategoryItem = z.infer<typeof IGDBCategoryItemSchema>
export type IGDBCategoryList = z.infer<typeof IGDBCategoryListSchema>
