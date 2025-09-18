import { PositiveNumberSchema } from '@trackplay/core/schemas'
import z from 'zod'

/**
 * Zod schema for validating an IGDB entity identifier.
 */
export const IGDBIdSchema = PositiveNumberSchema

export type IGDBId = z.infer<typeof IGDBIdSchema>
