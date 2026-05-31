import { ConfigurationError, isRecord, type Logger } from '@trackplay/core'
import { igdbCollectionAdapter } from '#adapters-out/collection/collection.provider'
import { igdbCompanyAdapter } from '#adapters-out/company/company.provider'
import { igdbGameAdapter } from '#adapters-out/game/game.provider'
import { igdbGameModeAdapter } from '#adapters-out/gameMode/gameMode.provider'
import { igdbGenreAdapter } from '#adapters-out/genre/genre.provider'
import { createIGDBFetcher } from '#adapters-out/helpers/http/igdb.http'
import { buildIGDBQuery } from '#adapters-out/helpers/query/igdb.query'
import { igdbPlatformAdapter } from '#adapters-out/platform/platform.provider'
import { igdbPlayerPerspectiveAdapter } from '#adapters-out/playerPerspective/playerPerspective.provider'
import { igdbThemeAdapter } from '#adapters-out/theme/theme.provider'
import { type AuthProviderPort } from '#ports/auth.port'
import { type TokenService } from '#services/token.service'
import { type Adapters } from '#types/container.type'

type AdaptersWithoutAuth = Omit<Adapters, 'auth'>

const igdbAdaptersConfig = {
  game: igdbGameAdapter,
  genre: igdbGenreAdapter,
  platform: igdbPlatformAdapter,
  collection: igdbCollectionAdapter,
  company: igdbCompanyAdapter,
  theme: igdbThemeAdapter,
  gameMode: igdbGameModeAdapter,
  playerPerspective: igdbPlayerPerspectiveAdapter,
} as const

const hasAllAdapters = (obj: unknown): obj is AdaptersWithoutAuth => {
  if (!isRecord(obj)) return false
  return Object.keys(igdbAdaptersConfig).every((name) => name in obj)
}

interface CreateIgdbAdaptersOptions {
  authAdapter: AuthProviderPort
  tokenService: TokenService
  apiUrl: string
  clientId: string
  logger: Logger
}

export const createIgdbAdapters = ({
  authAdapter,
  tokenService,
  apiUrl,
  clientId,
  logger,
}: CreateIgdbAdaptersOptions): Adapters => {
  const { fetch } = createIGDBFetcher(tokenService, apiUrl, clientId)

  const adapters = Object.fromEntries(
    Object.entries(igdbAdaptersConfig).map(([name, adapter]) => [name, adapter(fetch, buildIGDBQuery, logger)]),
  )

  if (!hasAllAdapters(adapters)) throw new ConfigurationError({ message: 'Failed to initialize IGDB adapters' })

  return { auth: authAdapter, ...adapters }
}
