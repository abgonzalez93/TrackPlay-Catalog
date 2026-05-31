import { type Logger } from '@trackplay/core'
import { createIgdbAdapters } from './adapter.helper.ts'
import { igdbAuthAdapter } from '#adapters-out/auth/auth.provider'
import { tokenService } from '#services/token.service'
import { type InfrastructureLayer } from '#types/container.type'
import { type IGDBProviderConfig } from '#types/provider.type'

export type ProviderInfrastructure = Omit<InfrastructureLayer, 'repositories'>

export const createIgdbProvider = (config: IGDBProviderConfig, logger: Logger): ProviderInfrastructure => {
  const { apiUrl, clientId, clientSecret, tokenUrl } = config

  const authAdapter = igdbAuthAdapter(clientId, clientSecret, tokenUrl)
  const tokenSvc = tokenService(authAdapter)
  const adapters = createIgdbAdapters({ authAdapter, tokenService: tokenSvc, apiUrl, clientId, logger })

  return { adapters, services: { token: tokenSvc } }
}
