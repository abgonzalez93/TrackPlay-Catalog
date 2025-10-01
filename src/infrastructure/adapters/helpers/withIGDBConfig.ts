import { validateSchema } from '@trackplay/core/utils'
import { fetchFromProvider } from '@utils/index'
import { AuthPort } from '@trackplay/core/ports'
import z, { ZodType } from 'zod'

/**
 * Configuration parameters for IGDB requests.
 */
interface IGDBFetchConfig<TSchema extends ZodType, TResult = z.infer<TSchema>> {
  apiUrl: string
  clientId: string
  endpoint: string
  query: string
  schema: TSchema
  mapper?: (data: z.infer<TSchema>) => TResult
  errorPath: string
}

/**
 * Performs an authenticated request to IGDB and returns raw data.
 *
 * @throws ProviderError if the HTTP request fails or returns invalid JSON.
 */
const fetchRawFromIGDB = async (
  authPort: AuthPort,
  config: Pick<IGDBFetchConfig<ZodType>, 'apiUrl' | 'clientId' | 'endpoint' | 'query' | 'errorPath'>,
): Promise<unknown> => {
  return fetchFromProvider(authPort, config)
}

/**
 * Validates raw IGDB data using the given Zod schema.
 *
 * @throws ValidationError if the schema validation fails.
 */
const validateIGDBResponse = <TSchema extends ZodType>(
  schema: TSchema,
  raw: unknown,
  errorPath: string,
): z.infer<TSchema> => {
  return validateSchema(schema, raw, `${errorPath}.invalid_format`)
}

/**
 * Maps a validated IGDB response to a domain-safe result.
 * If no mapper is provided, returns the validated data as-is.
 */
const mapIGDBResponse = <TValidated, TResult = TValidated>(
  validated: TValidated,
  mapper?: (data: TValidated) => TResult,
): TResult => {
  return mapper ? mapper(validated) : (validated as unknown as TResult)
}

/**
 * High-level orchestration that composes fetching, validation, and mapping.
 *
 * Keeps each responsibility isolated and testable.
 */
const fetchAndMapFromIGDB = async <TSchema extends ZodType, TResult>(
  authPort: AuthPort,
  params: IGDBFetchConfig<TSchema, TResult>,
): Promise<TResult> => {
  const { apiUrl, clientId, endpoint, query, schema, mapper, errorPath } = params

  const raw = await fetchRawFromIGDB(authPort, { apiUrl, clientId, endpoint, query, errorPath })
  const validated = validateIGDBResponse(schema, raw, errorPath)
  return mapIGDBResponse(validated, mapper)
}

/**
 * Creates a preconfigured IGDB fetcher with injected dependencies.
 *
 * Simplifies adapter implementations by removing repeated parameters.
 */
export const withIGDBConfig = (authPort: AuthPort, apiUrl: string, clientId: string, errorPath: string) => {
  const fetchConfigured = async <TSchema extends ZodType, TResult = z.infer<TSchema>>(
    params: Omit<IGDBFetchConfig<TSchema, TResult>, 'apiUrl' | 'clientId' | 'errorPath'>,
  ): Promise<TResult> => {
    return fetchAndMapFromIGDB(authPort, { apiUrl, clientId, errorPath, ...params })
  }

  return fetchConfigured
}
