import { type Genre, GenreSchema } from '@trackplay/catalog-domain'
import { createPersistenceMapper } from '../helpers/mappers/persistence.mapper.ts'
import { type GenreRepositoryPort } from '#ports/genre.port'
import { type PrismaClient, type Genre as PrismaGenre } from '#prisma/client'

const mapper = createPersistenceMapper<Genre, PrismaGenre>(GenreSchema)

export const prismaGenreRepository = (prisma: PrismaClient): GenreRepositoryPort => {
  const saveMany = async (genres: Genre[]): Promise<void> => {
    if (genres.length === 0) return

    const now = new Date()
    const operations = genres.map((genre) => {
      const data = mapper.toPersistence(genre)
      return prisma.genre.upsert({
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
