import { type GameMode, GameModeSchema } from '@trackplay/catalog-domain'
import { createPersistenceMapper } from '../helpers/mappers/persistence.mapper.ts'
import { type GameModeRepositoryPort } from '#ports/gameMode.port'
import { type PrismaClient, type GameMode as PrismaGameMode } from '#prisma/client'

const mapper = createPersistenceMapper<GameMode, PrismaGameMode>(GameModeSchema)

export const prismaGameModeRepository = (prisma: PrismaClient): GameModeRepositoryPort => {
  const saveMany = async (gameModes: GameMode[]): Promise<void> => {
    if (gameModes.length === 0) return

    const now = new Date()
    const operations = gameModes.map((gameMode) => {
      const data = mapper.toPersistence(gameMode)
      return prisma.gameMode.upsert({
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
