import { z } from 'zod'
import { IGDBNamedResourceSchema } from './common.schema.ts'

export const IGDBCollectionSchema = IGDBNamedResourceSchema

export const IGDBCollectionListSchema = z.array(IGDBCollectionSchema)
