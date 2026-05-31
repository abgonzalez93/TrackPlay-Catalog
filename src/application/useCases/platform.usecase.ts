import type { Platform, PlatformFilters } from '@trackplay/catalog-domain'
import { type Logger } from '@trackplay/core'
import type { PlatformProviderPort, PlatformRepositoryPort } from '#ports/platform.port'

export interface PlatformUseCase {
  getPlatforms(filters: PlatformFilters): Promise<Platform[]>
}

export const platformUseCase = (
  provider: PlatformProviderPort,
  repository: PlatformRepositoryPort,
  logger: Logger,
): PlatformUseCase => {
  const getPlatforms = async (filters: PlatformFilters): Promise<Platform[]> => {
    const platforms = await provider.getPlatforms(filters)

    if (platforms.length > 0) {
      void repository.saveMany(platforms).catch((error) => {
        logger.error('Failed to save platforms batch', { count: platforms.length, error })
      })
    }

    return platforms
  }

  return {
    getPlatforms,
  }
}
