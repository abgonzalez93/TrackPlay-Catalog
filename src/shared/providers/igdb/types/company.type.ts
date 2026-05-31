import { z } from 'zod'
import { IGDBCompanySchema, IGDBInvolvedCompanySchema } from '#igdbSchemas/company.schema'

export type IGDBCompany = z.infer<typeof IGDBCompanySchema>
export type IGDBInvolvedCompany = z.infer<typeof IGDBInvolvedCompanySchema>
