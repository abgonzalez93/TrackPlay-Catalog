import { IdSchema } from '@trackplay/core'
import { z } from 'zod'
import { IGDBImageSchema, IGDBNamedResourceSchema } from './common.schema.ts'

export const IGDBCompanySchema = IGDBNamedResourceSchema.extend({
  logo: IGDBImageSchema.optional(),
})

export const IGDBCompanyListSchema = z.array(IGDBCompanySchema)

export const IGDBInvolvedCompanySchema = z.object({
  id: IdSchema,
  company: IGDBCompanySchema.optional(),
  developer: z.boolean().optional(),
  publisher: z.boolean().optional(),
  porting: z.boolean().optional(),
  supporting: z.boolean().optional(),
})
