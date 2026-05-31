import { z } from 'zod'
import { IGDBThemeSchema } from '#igdbSchemas/theme.schema'

export type IGDBTheme = z.infer<typeof IGDBThemeSchema>
