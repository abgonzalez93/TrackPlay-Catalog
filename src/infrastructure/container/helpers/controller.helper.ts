import { collectionController } from '#controllers/collection.controller'
import { companyController } from '#controllers/company.controller'
import { gameController } from '#controllers/game.controller'
import { gameModeController } from '#controllers/gameMode.controller'
import { genreController } from '#controllers/genre.controller'
import { platformController } from '#controllers/platform.controller'
import { playerPerspectiveController } from '#controllers/playerPerspective.controller'
import { themeController } from '#controllers/theme.controller'
import type { Controllers, UseCases } from '#types/container.type'

export const resolveControllers = (useCases: UseCases): Controllers => ({
  game: gameController(useCases.game),
  genre: genreController(useCases.genre),
  platform: platformController(useCases.platform),
  collection: collectionController(useCases.collection),
  company: companyController(useCases.company),
  theme: themeController(useCases.theme),
  gameMode: gameModeController(useCases.gameMode),
  playerPerspective: playerPerspectiveController(useCases.playerPerspective),
})
