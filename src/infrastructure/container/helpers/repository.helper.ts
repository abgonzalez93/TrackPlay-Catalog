import { prismaCollectionRepository } from '#adapters-out/collection/collection.repository'
import { prismaCompanyRepository } from '#adapters-out/company/company.repository'
import { prismaGameRepository } from '#adapters-out/game/game.repository'
import { prismaGameModeRepository } from '#adapters-out/gameMode/gameMode.repository'
import { prismaGenreRepository } from '#adapters-out/genre/genre.repository'
import { prismaPlatformRepository } from '#adapters-out/platform/platform.repository'
import { prismaPlayerPerspectiveRepository } from '#adapters-out/playerPerspective/playerPerspective.repository'
import { prismaThemeRepository } from '#adapters-out/theme/theme.repository'
import { type PrismaClient } from '#prisma/client'
import { type Repositories } from '#types/container.type'

export const resolveRepositories = (prisma: PrismaClient): Repositories => ({
  game: prismaGameRepository(prisma),
  genre: prismaGenreRepository(prisma),
  platform: prismaPlatformRepository(prisma),
  collection: prismaCollectionRepository(prisma),
  company: prismaCompanyRepository(prisma),
  theme: prismaThemeRepository(prisma),
  gameMode: prismaGameModeRepository(prisma),
  playerPerspective: prismaPlayerPerspectiveRepository(prisma),
})
