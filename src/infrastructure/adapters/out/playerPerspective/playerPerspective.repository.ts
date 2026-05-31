import { type PlayerPerspective, PlayerPerspectiveSchema } from '@trackplay/catalog-domain'
import { createPersistenceMapper } from '../helpers/mappers/persistence.mapper.ts'
import { type PlayerPerspectiveRepositoryPort } from '#ports/playerPerspective.port'
import { type PrismaClient, type PlayerPerspective as PrismaPlayerPerspective } from '#prisma/client'

const mapper = createPersistenceMapper<PlayerPerspective, PrismaPlayerPerspective>(PlayerPerspectiveSchema)

export const prismaPlayerPerspectiveRepository = (prisma: PrismaClient): PlayerPerspectiveRepositoryPort => {
  const saveMany = async (playerPerspectives: PlayerPerspective[]): Promise<void> => {
    if (playerPerspectives.length === 0) return

    const now = new Date()
    const operations = playerPerspectives.map((pp) => {
      const data = mapper.toPersistence(pp)
      return prisma.playerPerspective.upsert({
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
