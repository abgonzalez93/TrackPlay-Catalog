import { registerRoute, type TrackPlayRouter } from '@trackplay/runtime'
import { ROUTES } from '#constants/routes.constant'
import { type PlatformController } from '#controllers/platform.controller'

export const platformRoutes = (router: TrackPlayRouter, controller: PlatformController): void => {
  registerRoute(router, {
    prefix: ROUTES.API.PLATFORMS,
    setup: (route) => {
      route.get('/', controller.getPlatforms)
    },
  })
}
