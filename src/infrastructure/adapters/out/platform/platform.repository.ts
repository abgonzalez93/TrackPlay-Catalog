import { type Platform, PlatformSchema } from '@trackplay/catalog-domain'
import { createPersistenceMapper } from '../helpers/mappers/persistence.mapper.ts'
import { type PlatformRepositoryPort } from '#ports/platform.port'
import { type PrismaClient, type Platform as PrismaPlatform } from '#prisma/client'

const mapper = createPersistenceMapper<Platform, PrismaPlatform>(PlatformSchema)

export const prismaPlatformRepository = (prisma: PrismaClient): PlatformRepositoryPort => {
  const saveMany = async (platforms: Platform[]): Promise<void> => {
    if (platforms.length === 0) return

    const now = new Date()
    const operations = platforms.map((platform) => {
      const data = mapper.toPersistence(platform)
      return prisma.platform.upsert({
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
