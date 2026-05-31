import { TrackPlayError, ExternalServiceError, validateSchema } from '@trackplay/core'
import { HTTP_STATUS } from '@trackplay/core'
import { z, type ZodType } from 'zod'
import { type TokenService } from '#services/token.service'
import { type ProviderToken } from '#types/provider.type'

const buildProviderHeaders = ({ type, token }: ProviderToken, clientId?: string): Headers => {
  const headers = new Headers()
  headers.append('Content-Type', 'text/plain')

  if (clientId) headers.append('Client-ID', clientId)
  if (type === 'bearer') headers.append('Authorization', `Bearer ${token}`)
  if (type === 'apiKey') headers.append('Authorization', token)

  return headers
}

interface ExecuteQueryOptions {
  apiUrl: string
  endpoint: string
  query: string
  clientId?: string
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const shouldRetryError = (error: unknown, attempt: number, maxRetries: number): boolean => {
  if (attempt >= maxRetries) return false

  if (error instanceof ExternalServiceError) {
    const status = error.i18nArgs?.status

    if (typeof status === 'number') {
      return status >= HTTP_STATUS.INTERNAL_SERVER_ERROR || status === HTTP_STATUS.TOO_MANY_REQUESTS
    }
  }

  return error instanceof TypeError
}

const performHttpRequest = async (url: string, headers: Headers, body: string): Promise<unknown> => {
  const response = await fetch(url, {
    method: 'POST',
    body,
    headers,
  })

  if (response.ok) return await response.json()
  const errorDetails = await response.text()

  throw new ExternalServiceError({
    i18nKey: 'catalog.providers.request_failed',
    i18nArgs: { status: response.status, details: errorDetails },
  })
}

const executeProviderRequest = async (providerToken: ProviderToken, options: ExecuteQueryOptions): Promise<unknown> => {
  const { apiUrl, endpoint, query, clientId } = options
  const headers = buildProviderHeaders(providerToken, clientId)
  const url = `${apiUrl}/${endpoint}`

  const maxRetries = 3
  const maxBackoffMs = 10_000
  let attempt = 0
  let backoffMs = 300

  while (true) {
    try {
      return await performHttpRequest(url, headers, query)
    } catch (error) {
      if (!shouldRetryError(error, attempt, maxRetries)) {
        if (error instanceof TrackPlayError) throw error

        throw new ExternalServiceError({
          i18nKey: 'catalog.providers.fetch_error',
          i18nArgs: { endpoint },
          errors: { error },
        })
      }

      await wait(backoffMs)
      backoffMs = Math.min(backoffMs * 2, maxBackoffMs)
      attempt++
    }
  }
}

interface IGDBFetcherOptions<Schema extends ZodType> {
  endpoint: string
  query: string
  schema: Schema
}

export type IGDBFetch = <Schema extends ZodType>(options: IGDBFetcherOptions<Schema>) => Promise<z.infer<Schema>>

interface IGDBFetcher {
  fetch: IGDBFetch
}

export const createIGDBFetcher = (tokenService: TokenService, apiUrl: string, clientId: string): IGDBFetcher => {
  const fetch = async <Schema extends ZodType>(options: IGDBFetcherOptions<Schema>): Promise<z.infer<Schema>> => {
    const providerToken = await tokenService.requestToken()

    const raw = await executeProviderRequest(providerToken, {
      ...options,
      apiUrl,
      clientId,
    })

    return validateSchema(options.schema, raw, { i18nKey: 'catalog.providers.invalid_response' })
  }

  return { fetch }
}
