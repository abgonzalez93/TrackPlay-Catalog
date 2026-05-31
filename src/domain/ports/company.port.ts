import type { Company, CompanyFilters } from '@trackplay/catalog-domain'
import { type Id } from '@trackplay/core'
import { type CachedEntity } from '#types/cache.type'

export interface CompanyProviderPort {
  getCompanies(filters: CompanyFilters): Promise<Company[]>
  getCompanyById(id: Id): Promise<Company | null>
}

export interface CompanyRepositoryPort {
  save(company: Company): Promise<void>
  saveMany(companies: Company[]): Promise<void>
  findById(id: Id): Promise<CachedEntity<Company> | null>
}
