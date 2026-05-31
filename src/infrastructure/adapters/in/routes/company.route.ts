import { registerRoute, type TrackPlayRouter } from '@trackplay/runtime'
import { ROUTES } from '#constants/routes.constant'
import { type CompanyController } from '#controllers/company.controller'

export const companyRoutes = (router: TrackPlayRouter, controller: CompanyController): void => {
  registerRoute(router, {
    prefix: ROUTES.API.COMPANIES,
    setup: (route) => {
      route.get('/', controller.getCompanies)
      route.get('/:id', controller.getCompanyById)
    },
  })
}
