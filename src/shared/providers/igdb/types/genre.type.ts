import { z } from 'zod'
import { IGDBGenreSchema } from '#igdbSchemas/genre.schema'

export type IGDBGenre = z.infer<typeof IGDBGenreSchema>
