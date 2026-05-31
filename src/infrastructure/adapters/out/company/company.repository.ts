import { type Company, CompanySchema } from '@trackplay/catalog-domain'
import { type Id } from '@trackplay/core'
import { createPersistenceMapper } from '../helpers/mappers/persistence.mapper.ts'
import { type CompanyRepositoryPort } from '#ports/company.port'
import { type PrismaClient, type Company as PrismaCompany } from '#prisma/client'
import { type CachedEntity } from '#types/cache.type'

const mapper = createPersistenceMapper<Company, PrismaCompany>(CompanySchema)

export const prismaCompanyRepository = (prisma: PrismaClient): CompanyRepositoryPort => {
  const saveMany = async (companies: Company[]): Promise<void> => {
    if (companies.length === 0) return

    const now = new Date()
    const operations = companies.map((company) => {
      const data = mapper.toPersistence(company)
      return prisma.company.upsert({
        where: { igdbId: data.igdbId },
        update: { ...data, lastSyncAt: now },
        create: { ...data, lastSyncAt: now },
      })
    })

    await prisma.$transaction(operations)
  }

  const save = async (company: Company): Promise<void> => saveMany([company])

  const findById = async (id: Id): Promise<CachedEntity<Company> | null> => {
    const company = await prisma.company.findUnique({
      where: { igdbId: id },
    })

    if (!company) return null

    return {
      data: mapper.toDomain(company),
      lastSyncAt: company.lastSyncAt,
    }
  }

  return {
    save,
    saveMany,
    findById,
  }
}
