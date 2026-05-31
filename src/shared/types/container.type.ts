import { type BaseInfrastructureLayer } from '@trackplay/runtime'
import { type CollectionController } from '#controllers/collection.controller'
import { type CompanyController } from '#controllers/company.controller'
import { type GameController } from '#controllers/game.controller'
import { type GameModeController } from '#controllers/gameMode.controller'
import { type GenreController } from '#controllers/genre.controller'
import { type PlatformController } from '#controllers/platform.controller'
import { type PlayerPerspectiveController } from '#controllers/playerPerspective.controller'
import { type ThemeController } from '#controllers/theme.controller'
import { type AuthProviderPort } from '#ports/auth.port'
import type { CollectionProviderPort, CollectionRepositoryPort } from '#ports/collection.port'
import type { CompanyProviderPort, CompanyRepositoryPort } from '#ports/company.port'
import type { GameProviderPort, GameRepositoryPort } from '#ports/game.port'
import type { GameModeProviderPort, GameModeRepositoryPort } from '#ports/gameMode.port'
import type { GenreProviderPort, GenreRepositoryPort } from '#ports/genre.port'
import type { PlatformProviderPort, PlatformRepositoryPort } from '#ports/platform.port'
import type { PlayerPerspectiveProviderPort, PlayerPerspectiveRepositoryPort } from '#ports/playerPerspective.port'
import type { ThemeProviderPort, ThemeRepositoryPort } from '#ports/theme.port'
import { type TokenService } from '#services/token.service'
import { type CollectionUseCase } from '#useCases/collection.usecase'
import { type CompanyUseCase } from '#useCases/company.usecase'
import { type GameUseCase } from '#useCases/game.usecase'
import { type GameModeUseCase } from '#useCases/gameMode.usecase'
import { type GenreUseCase } from '#useCases/genre.usecase'
import { type PlatformUseCase } from '#useCases/platform.usecase'
import { type PlayerPerspectiveUseCase } from '#useCases/playerPerspective.usecase'
import { type ThemeUseCase } from '#useCases/theme.usecase'

export type Adapters = {
  auth: AuthProviderPort
  game: GameProviderPort
  genre: GenreProviderPort
  platform: PlatformProviderPort
  collection: CollectionProviderPort
  company: CompanyProviderPort
  theme: ThemeProviderPort
  gameMode: GameModeProviderPort
  playerPerspective: PlayerPerspectiveProviderPort
}

export type Services = {
  token: TokenService
}

export type Repositories = {
  game: GameRepositoryPort
  genre: GenreRepositoryPort
  platform: PlatformRepositoryPort
  collection: CollectionRepositoryPort
  company: CompanyRepositoryPort
  theme: ThemeRepositoryPort
  gameMode: GameModeRepositoryPort
  playerPerspective: PlayerPerspectiveRepositoryPort
}

export type InfrastructureLayer = BaseInfrastructureLayer<Adapters, Services, Repositories>

export interface UseCases {
  game: GameUseCase
  genre: GenreUseCase
  platform: PlatformUseCase
  collection: CollectionUseCase
  company: CompanyUseCase
  theme: ThemeUseCase
  gameMode: GameModeUseCase
  playerPerspective: PlayerPerspectiveUseCase
}

export interface Controllers {
  game: GameController
  genre: GenreController
  platform: PlatformController
  collection: CollectionController
  company: CompanyController
  theme: ThemeController
  gameMode: GameModeController
  playerPerspective: PlayerPerspectiveController
}
