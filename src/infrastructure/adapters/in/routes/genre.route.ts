import { registerRoute, type TrackPlayRouter } from '@trackplay/runtime'
import { ROUTES } from '#constants/routes.constant'
import { type GenreController } from '#controllers/genre.controller'

export const genreRoutes = (router: TrackPlayRouter, controller: GenreController): void => {
  registerRoute(router, {
    prefix: ROUTES.API.GENRES,
    setup: (route) => {
      route.get('/', controller.getGenres)
    },
  })
}
