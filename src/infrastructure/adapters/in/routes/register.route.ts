import { type TrackPlayRouter } from '@trackplay/runtime'
import { collectionRoutes } from './collection.route.ts'
import { companyRoutes } from './company.route.ts'
import { gameRoutes } from './game.route.ts'
import { gameModeRoutes } from './gameMode.route.ts'
import { genreRoutes } from './genre.route.ts'
import { platformRoutes } from './platform.route.ts'
import { playerPerspectiveRoutes } from './playerPerspective.route.ts'
import { themeRoutes } from './theme.route.ts'
import { type Controllers } from '#types/container.type'

export const registerRoutes = (router: TrackPlayRouter, controllers: Controllers): void => {
  gameRoutes(router, controllers.game)
  genreRoutes(router, controllers.genre)
  platformRoutes(router, controllers.platform)
  collectionRoutes(router, controllers.collection)
  companyRoutes(router, controllers.company)
  themeRoutes(router, controllers.theme)
  gameModeRoutes(router, controllers.gameMode)
  playerPerspectiveRoutes(router, controllers.playerPerspective)
}
