import { registerRoute, type TrackPlayRouter } from '@trackplay/runtime'
import { ROUTES } from '#constants/routes.constant'
import { type GameController } from '#controllers/game.controller'

export const gameRoutes = (router: TrackPlayRouter, controller: GameController): void => {
  registerRoute(router, {
    prefix: ROUTES.API.GAMES,
    setup: (route) => {
      route.get('/', controller.getGames)
      route.get('/:id', controller.getGameById)
    },
  })
}
