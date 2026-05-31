import { CompanyFiltersSchema } from '@trackplay/catalog-domain'
import { HTTP_STATUS, IdSchema, validateSchema } from '@trackplay/core'
import type { TrackPlayRequest, TrackPlayResponse } from '@trackplay/runtime'
import { type CompanyUseCase } from '#useCases/company.usecase'

export interface CompanyController {
  getCompanies(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
  getCompanyById(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
}

export const companyController = (companyUseCase: CompanyUseCase): CompanyController => {
  const getCompanies = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const filters = validateSchema(CompanyFiltersSchema, req.query, { i18nKey: 'catalog.filters.invalid_format' })
    const companies = await companyUseCase.getCompanies(filters)
    res.status(HTTP_STATUS.OK).json(companies)
  }

  const getCompanyById = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const id = validateSchema(IdSchema, req.params.id, { i18nKey: 'catalog.companies.invalid_id' })
    const company = await companyUseCase.getCompanyById(id)
    res.status(HTTP_STATUS.OK).json(company)
  }

  return {
    getCompanies,
    getCompanyById,
  }
}
