import { z } from 'zod'

export const unwrapSchema = (schema: unknown): unknown => {
  let s = schema
  while (s instanceof z.ZodOptional || s instanceof z.ZodNullable) s = s.unwrap()
  return s
}

export const isJsonType = (schema: unknown): boolean => {
  const s = unwrapSchema(schema)
  return s instanceof z.ZodObject || s instanceof z.ZodArray
}
