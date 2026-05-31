import { registerRoute, type TrackPlayRouter } from '@trackplay/runtime'
import { ROUTES } from '#constants/routes.constant'
import { type PlayerPerspectiveController } from '#controllers/playerPerspective.controller'

export const playerPerspectiveRoutes = (router: TrackPlayRouter, controller: PlayerPerspectiveController): void => {
  registerRoute(router, {
    prefix: ROUTES.API.PLAYER_PERSPECTIVES,
    setup: (route) => {
      route.get('/', controller.getPlayerPerspectives)
    },
  })
}
