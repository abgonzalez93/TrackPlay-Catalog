import { type Game, GameSchema } from '@trackplay/catalog-domain'
import { type Id } from '@trackplay/core'
import { createPersistenceMapper } from '../helpers/mappers/persistence.mapper.ts'
import { type GameRepositoryPort } from '#ports/game.port'
import { Prisma, type PrismaClient, type Game as PrismaGame } from '#prisma/client'
import { type CachedEntity } from '#types/cache.type'

const mapper = createPersistenceMapper<Game, PrismaGame>(GameSchema, Prisma.GameScalarFieldEnum)

export const prismaGameRepository = (prisma: PrismaClient): GameRepositoryPort => {
  const saveMany = async (games: Game[]): Promise<void> => {
    if (games.length === 0) return

    const now = new Date()

    await prisma.$transaction(async (tx) => {
      for (const game of games) {
        const data = mapper.toPersistence(game)

        await tx.game.upsert({
          where: { igdbId: data.igdbId },
          update: { ...mapper.forUpdate(data), lastSyncAt: now },
          create: { ...data, lastSyncAt: now },
        })
      }
    })
  }

  const save = async (game: Game): Promise<void> => saveMany([game])

  const findById = async (id: Id): Promise<CachedEntity<Game> | null> => {
    const game = await prisma.game.findUnique({
      where: { igdbId: id },
      include: mapper.buildInclude(),
    })

    if (!game) return null

    return {
      data: mapper.toDomain(game),
      lastSyncAt: game.lastSyncAt,
    }
  }

  return {
    save,
    saveMany,
    findById,
  }
}
