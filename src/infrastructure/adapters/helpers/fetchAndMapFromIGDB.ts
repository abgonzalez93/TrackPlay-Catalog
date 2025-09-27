import { validateSchema } from '@trackplay/core/utils'
import { fetchFromProvider } from '@utils/index'
import { AuthPort } from '@trackplay/core/ports'
import z, { ZodType } from 'zod'

/**
 * Defines the configuration parameters required to perform a
 * typed and validated request against the IGDB API.
 *
 * @template TSchema - The Zod schema type for validation.
 * @template TResult - The final mapped result type (defaults to schema output).
 */
interface FetchAndMapFromIGDBParams<TSchema extends ZodType, TResult = z.infer<TSchema>> {
  apiUrl: string
  clientId: string
  endpoint: string
  query: string
  schema: TSchema
  mapper?: (data: z.infer<TSchema>) => TResult
  errorPath: string
}

/**
 * Generic helper to fetch, validate, and map data from IGDB.
 *
 * Responsibilities:
 * - Executes an authenticated provider request via {@link fetchFromProvider}.
 * - Validates the raw response using a {@link z.ZodType}.
 * - Optionally maps validated data via a transformation function.
 *
 * Notes:
 * - Designed for IGDB adapters (e.g. games, categories, themes).
 * - Keeps adapter implementations concise and consistent.
 *
 * @template TSchema The type of Zod schema for validation.
 * @template TResult The final mapped result type.
 *
 * @param authPort - {@link AuthPort} instance responsible for providing authentication tokens.
 * @param params - Configuration options defined by {@link FetchAndMapFromIGDBParams}.
 * @returns Promise resolving to the validated and optionally mapped result.
 */
export const fetchAndMapFromIGDB = async <TSchema extends ZodType, TResult>(
  authPort: AuthPort,
  params: FetchAndMapFromIGDBParams<TSchema, TResult>,
): Promise<TResult> => {
  const { apiUrl, clientId, endpoint, query, schema, mapper, errorPath } = params

  const raw = await fetchFromProvider(authPort, {
    apiUrl,
    endpoint,
    query,
    clientId,
    errorPath,
  })

  const validated = validateSchema(schema, raw, `${errorPath}.invalid_format`)
  return (mapper ? mapper(validated) : validated) as TResult
}
