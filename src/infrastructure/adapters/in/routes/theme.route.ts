import { registerRoute, type TrackPlayRouter } from '@trackplay/runtime'
import { ROUTES } from '#constants/routes.constant'
import { type ThemeController } from '#controllers/theme.controller'

export const themeRoutes = (router: TrackPlayRouter, controller: ThemeController): void => {
  registerRoute(router, {
    prefix: ROUTES.API.THEMES,
    setup: (route) => {
      route.get('/', controller.getThemes)
    },
  })
}
