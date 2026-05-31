import { registerRoute, type TrackPlayRouter } from '@trackplay/runtime'
import { ROUTES } from '#constants/routes.constant'
import { type CollectionController } from '#controllers/collection.controller'

export const collectionRoutes = (router: TrackPlayRouter, controller: CollectionController): void => {
  registerRoute(router, {
    prefix: ROUTES.API.COLLECTIONS,
    setup: (route) => {
      route.get('/', controller.getCollections)
      route.get('/:id', controller.getCollectionById)
    },
  })
}
