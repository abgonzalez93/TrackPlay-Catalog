import { type Theme, ThemeSchema } from '@trackplay/catalog-domain'
import { createPersistenceMapper } from '../helpers/mappers/persistence.mapper.ts'
import { type ThemeRepositoryPort } from '#ports/theme.port'
import { type PrismaClient, type Theme as PrismaTheme } from '#prisma/client'

const mapper = createPersistenceMapper<Theme, PrismaTheme>(ThemeSchema)

export const prismaThemeRepository = (prisma: PrismaClient): ThemeRepositoryPort => {
  const saveMany = async (themes: Theme[]): Promise<void> => {
    if (themes.length === 0) return

    const now = new Date()
    const operations = themes.map((theme) => {
      const data = mapper.toPersistence(theme)
      return prisma.theme.upsert({
        where: { igdbId: data.igdbId },
        update: { ...data, lastSyncAt: now },
        create: { ...data, lastSyncAt: now },
      })
    })

    await prisma.$transaction(operations)
  }

  return {
    saveMany,
  }
}
