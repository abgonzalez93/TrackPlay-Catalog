import type { Company, CompanyFilters } from '@trackplay/catalog-domain'
import { type Id, type Logger, NotFoundError } from '@trackplay/core'
import { isStale, revalidateInBackground } from './helpers/cache.helper.ts'
import type { CompanyProviderPort, CompanyRepositoryPort } from '#ports/company.port'

export interface CompanyUseCase {
  getCompanies(filters: CompanyFilters): Promise<Company[]>
  getCompanyById(id: Id): Promise<Company>
}

export const companyUseCase = (
  provider: CompanyProviderPort,
  repository: CompanyRepositoryPort,
  logger: Logger,
): CompanyUseCase => {
  const getCompanies = async (filters: CompanyFilters): Promise<Company[]> => {
    const companies = await provider.getCompanies(filters)

    if (companies.length > 0) {
      void repository.saveMany(companies).catch((error) => {
        logger.error('Failed to save companies batch', { count: companies.length, error })
      })
    }

    return companies
  }

  const getCompanyById = async (id: Id): Promise<Company> => {
    const cached = await repository.findById(id)

    if (cached) {
      if (isStale(cached.lastSyncAt)) {
        revalidateInBackground({
          id,
          fetch: provider.getCompanyById,
          save: repository.save,
          logger,
          entityName: 'company',
        })
      }
      return cached.data
    }

    const externalCompany = await provider.getCompanyById(id)

    if (externalCompany) {
      void repository.save(externalCompany).catch((error) => {
        logger.error('Failed to save company', { id, error })
      })

      return externalCompany
    }

    throw new NotFoundError({ i18nKey: 'catalog.companies.not_found' })
  }

  return {
    getCompanies,
    getCompanyById,
  }
}
