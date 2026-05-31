import { type AuthProviderPort } from '#ports/auth.port'
import { type ProviderToken } from '#types/provider.type'

const EXPIRATION_BUFFER_MS = 10_000

export interface TokenService {
  requestToken(): Promise<ProviderToken>
}

export const tokenService = (authPort: AuthProviderPort): TokenService => {
  let cachedToken: ProviderToken | null = null
  let pendingRequest: Promise<ProviderToken> | null = null

  const isValidToken = (token: ProviderToken | null): token is ProviderToken => {
    if (!token) return false
    if (token.type === 'apiKey') return true
    if (token.type === 'bearer') return Date.now() + EXPIRATION_BUFFER_MS < token.expiresAt
    return false
  }

  const requestToken = async (): Promise<ProviderToken> => {
    if (isValidToken(cachedToken)) return cachedToken

    if (!pendingRequest) {
      pendingRequest = authPort
        .requestToken()
        .then((token) => {
          cachedToken = token
          return token
        })
        .finally(() => {
          pendingRequest = null
        })
    }

    return pendingRequest
  }

  return {
    requestToken,
  }
}
