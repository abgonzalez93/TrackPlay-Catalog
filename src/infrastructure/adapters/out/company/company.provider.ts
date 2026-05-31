import { type Company, type CompanyFilters, CompanySchema } from '@trackplay/catalog-domain'
import { type Id, type Logger } from '@trackplay/core'
import { type IGDBFetch } from '../helpers/http/igdb.http.ts'
import { createProviderMapper } from '../helpers/mappers/provider.mapper.ts'
import { type BuildIGDBQuery } from '../helpers/query/igdb.query.ts'
import { ROUTES } from '#constants/routes.constant'
import { IGDB } from '#igdbConstants/igdb.constant'
import { IGDBCompanyListSchema } from '#igdbSchemas/company.schema'
import { type IGDBCompany } from '#igdbTypes/company.type'
import { type CompanyProviderPort } from '#ports/company.port'

const endpoint = ROUTES.IGDB.COMPANIES
const fields = IGDB.COMPANIES.FIELDS

const mapper = createProviderMapper<IGDBCompany, Company>(CompanySchema)

export const igdbCompanyAdapter = (fetch: IGDBFetch, buildQuery: BuildIGDBQuery, logger: Logger): CompanyProviderPort => {
  const getCompanies = async (filters: CompanyFilters): Promise<Company[]> => {
    const query = buildQuery(fields, filters)

    const companies = await fetch({
      endpoint,
      query,
      schema: IGDBCompanyListSchema,
    })

    return mapper.toDomainList(companies, logger)
  }

  const getCompanyById = async (id: Id): Promise<Company | null> => {
    const query = buildQuery(fields, { where: `id = ${id}` })

    const [company] = await fetch({
      endpoint,
      query,
      schema: IGDBCompanyListSchema,
    })

    return company ? mapper.toDomain(company) : null
  }

  return {
    getCompanies,
    getCompanyById,
  }
}
