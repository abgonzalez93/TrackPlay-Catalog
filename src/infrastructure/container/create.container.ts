import { connectPrisma, createPrisma } from '@trackplay/core'
import { type ContainerFactory } from '@trackplay/runtime'
import { resolveControllers } from './helpers/controller.helper.ts'
import { resolveProvider } from './helpers/provider.helper.ts'
import { resolveRepositories } from './helpers/repository.helper.ts'
import { resolveUseCases } from './helpers/usecase.helper.ts'
import { PrismaClient } from '#prisma/client'
import type { CatalogEnv, CatalogSecrets } from '#types/config.type'
import type { Controllers, InfrastructureLayer, UseCases } from '#types/container.type'

export const container: ContainerFactory<CatalogEnv, CatalogSecrets, InfrastructureLayer, UseCases, Controllers> = {
  infrastructure: async ({ env, secrets, logger }) => {
    const prisma = createPrisma(PrismaClient, secrets.DATABASE_URL)
    await connectPrisma(prisma, logger)

    const { adapters, services } = resolveProvider(env, secrets, logger)
    const repositories = resolveRepositories(prisma)
    return { adapters, services, repositories }
  },
  application: (infra, logger) => resolveUseCases(infra, logger),
  interface: (useCases) => resolveControllers(useCases),
}
