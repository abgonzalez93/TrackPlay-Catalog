import { type Logger } from '@trackplay/core'
import type { InfrastructureLayer, UseCases } from '#types/container.type'
import { collectionUseCase } from '#useCases/collection.usecase'
import { companyUseCase } from '#useCases/company.usecase'
import { gameUseCase } from '#useCases/game.usecase'
import { gameModeUseCase } from '#useCases/gameMode.usecase'
import { genreUseCase } from '#useCases/genre.usecase'
import { platformUseCase } from '#useCases/platform.usecase'
import { playerPerspectiveUseCase } from '#useCases/playerPerspective.usecase'
import { themeUseCase } from '#useCases/theme.usecase'

export const resolveUseCases = ({ adapters, repositories }: InfrastructureLayer, logger: Logger): UseCases => ({
  game: gameUseCase(adapters.game, repositories.game, logger),
  genre: genreUseCase(adapters.genre, repositories.genre, logger),
  platform: platformUseCase(adapters.platform, repositories.platform, logger),
  collection: collectionUseCase(adapters.collection, repositories.collection, logger),
  company: companyUseCase(adapters.company, repositories.company, logger),
  theme: themeUseCase(adapters.theme, repositories.theme, logger),
  gameMode: gameModeUseCase(adapters.gameMode, repositories.gameMode, logger),
  playerPerspective: playerPerspectiveUseCase(adapters.playerPerspective, repositories.playerPerspective, logger),
})
