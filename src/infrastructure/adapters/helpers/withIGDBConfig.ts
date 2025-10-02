import { validateSchema } from '@trackplay/core/utils'
import { fetchFromProvider } from '@utils/index'
import { ProviderTokenPort } from '@trackplay/core/ports'
import z, { ZodType } from 'zod'

/**
 * **IGDB Fetch Configuration**
 *
 * Defines the configuration parameters required to perform a typed,
 * authenticated, and validated request against the IGDB API.
 *
 * @template TSchema - The Zod schema used to validate the response.
 * @template TResult - The final mapped result type after validation.
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
 * Performs an authenticated HTTP request to the IGDB API.
 *
 * Uses the provided {@link ProviderTokenPort} to obtain a valid bearer token
 * before executing the network call via {@link fetchFromProvider}.
 *
 * @param authPort - The authentication port providing valid provider tokens.
 * @param config - The minimal request configuration (endpoint, query, etc.).
 * @returns The raw JSON response from the IGDB API.
 *
 * @throws {ProviderError} If the HTTP request fails or response cannot be parsed.
 */
const fetchRawFromIGDB = async (
  authPort: ProviderTokenPort,
  config: Pick<IGDBFetchConfig<ZodType>, 'apiUrl' | 'clientId' | 'endpoint' | 'query' | 'errorPath'>,
): Promise<unknown> => {
  return fetchFromProvider(authPort, config)
}

/**
 * Validates a raw IGDB response using the provided Zod schema.
 *
 * Ensures that all downstream consumers receive only
 * structurally valid and strongly typed data.
 *
 * @template TSchema - The Zod schema used for validation.
 * @param schema - The schema to validate against.
 * @param raw - The unvalidated API response.
 * @param errorPath - The translation path for contextualized errors.
 * @returns The validated response data.
 *
 * @throws {ValidationError} If schema validation fails.
 */
const validateIGDBResponse = <TSchema extends ZodType>(
  schema: TSchema,
  raw: unknown,
  errorPath: string,
): z.infer<TSchema> => {
  return validateSchema(schema, raw, `${errorPath}.invalid_format`)
}

/**
 * Maps a validated IGDB response into a domain-safe result.
 *
 * If no mapper is provided, returns the validated data unchanged.
 *
 * @template TValidated - The validated data type (schema output).
 * @template TResult - The mapped result type.
 * @param validated - The validated IGDB response.
 * @param mapper - Optional transformation function.
 * @returns The transformed (or original) data.
 */
const mapIGDBResponse = <TValidated, TResult = TValidated>(
  validated: TValidated,
  mapper?: (data: TValidated) => TResult,
): TResult => {
  return mapper ? mapper(validated) : (validated as unknown as TResult)
}

/**
 * **High-Level IGDB Fetcher**
 *
 * Composes the three core steps of an IGDB request:
 * 1. **Fetch** raw data using {@link fetchFromProvider}.
 * 2. **Validate** the response against a Zod schema.
 * 3. **Map** the validated result into a domain-safe format.
 *
 * Each step remains isolated for improved testability and reuse.
 *
 * @template TSchema - The Zod schema type used for validation.
 * @template TResult - The mapped result type after transformation.
 * @param authPort - The {@link ProviderTokenPort} for authenticated requests.
 * @param params - The full IGDB request configuration.
 * @returns The fully validated and mapped result.
 *
 * @throws {ProviderError} If the HTTP request fails.
 * @throws {ValidationError} If schema validation fails.
 */
const fetchAndMapFromIGDB = async <TSchema extends ZodType, TResult>(
  authPort: ProviderTokenPort,
  params: IGDBFetchConfig<TSchema, TResult>,
): Promise<TResult> => {
  const { apiUrl, clientId, endpoint, query, schema, mapper, errorPath } = params

  const raw = await fetchRawFromIGDB(authPort, { apiUrl, clientId, endpoint, query, errorPath })
  const validated = validateIGDBResponse(schema, raw, errorPath)
  return mapIGDBResponse(validated, mapper)
}

/**
 * **withIGDBConfig**
 *
 * Factory function that returns a preconfigured IGDB fetcher
 * with injected dependencies (`authPort`, `apiUrl`, `clientId`, `errorPath`).
 *
 * This simplifies adapter implementations by eliminating
 * repetitive setup for common IGDB request parameters.
 *
 * ### Responsibilities
 * - Inject shared configuration values for IGDB requests.
 * - Provide a typed, reusable fetcher for infrastructure adapters.
 * - Maintain isolation of fetch, validation, and mapping concerns.
 *
 * @param authPort - The {@link ProviderTokenPort} providing access tokens.
 * @param apiUrl - The IGDB API base URL.
 * @param clientId - The IGDB client identifier.
 * @param errorPath - The translation path for contextual error messages.
 * @returns A reusable function for performing typed IGDB requests.
 */
export const withIGDBConfig = (authPort: ProviderTokenPort, apiUrl: string, clientId: string, errorPath: string) => {
  const fetchConfigured = async <TSchema extends ZodType, TResult = z.infer<TSchema>>(
    params: Omit<IGDBFetchConfig<TSchema, TResult>, 'apiUrl' | 'clientId' | 'errorPath'>,
  ): Promise<TResult> => {
    return fetchAndMapFromIGDB(authPort, { apiUrl, clientId, errorPath, ...params })
  }

  return fetchConfigured
}
