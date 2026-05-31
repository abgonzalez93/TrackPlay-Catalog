import { registerRoute, type TrackPlayRouter } from '@trackplay/runtime'
import { ROUTES } from '#constants/routes.constant'
import { type GameModeController } from '#controllers/gameMode.controller'

export const gameModeRoutes = (router: TrackPlayRouter, controller: GameModeController): void => {
  registerRoute(router, {
    prefix: ROUTES.API.GAME_MODES,
    setup: (route) => {
      route.get('/', controller.getGameModes)
    },
  })
}
