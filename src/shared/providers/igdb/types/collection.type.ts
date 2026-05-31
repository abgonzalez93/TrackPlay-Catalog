import { z } from 'zod'
import { IGDBCollectionSchema } from '#igdbSchemas/collection.schema'

export type IGDBCollection = z.infer<typeof IGDBCollectionSchema>
