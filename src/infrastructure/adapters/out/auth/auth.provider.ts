import { ExternalServiceError, TrackPlayError, validateSchema } from '@trackplay/core'
import { IGDBTokenSchema } from '#igdbSchemas/auth.schema'
import { type AuthProviderPort } from '#ports/auth.port'
import { type ProviderToken } from '#types/provider.type'

export const igdbAuthAdapter = (clientId: string, clientSecret: string, tokenUrl: string): AuthProviderPort => {
  const requestToken = async (): Promise<ProviderToken> => {
    try {
      const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      })

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })

      if (!response.ok)
        throw new ExternalServiceError({
          i18nKey: 'catalog.providers.auth_failed',
          errors: { status: response.status, statusText: response.statusText },
        })

      const raw: unknown = await response.json()
      const token = validateSchema(IGDBTokenSchema, raw, { i18nKey: 'catalog.providers.invalid_response' })

      return {
        expiresAt: Date.now() + token.expires_in * 1000,
        token: token.access_token,
        type: 'bearer',
      }
    } catch (error) {
      if (error instanceof TrackPlayError) throw error
      throw new ExternalServiceError({ i18nKey: 'catalog.providers.connection_failed', errors: { error } })
    }
  }

  return {
    requestToken,
  }
}
