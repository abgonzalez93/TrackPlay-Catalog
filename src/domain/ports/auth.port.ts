import { type ProviderToken } from '#types/provider.type'

export interface AuthProviderPort {
  requestToken(): Promise<ProviderToken>
}
