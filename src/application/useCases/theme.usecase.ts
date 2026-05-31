import type { Theme, ThemeFilters } from '@trackplay/catalog-domain'
import { type Logger } from '@trackplay/core'
import type { ThemeProviderPort, ThemeRepositoryPort } from '#ports/theme.port'

export interface ThemeUseCase {
  getThemes(filters: ThemeFilters): Promise<Theme[]>
}

export const themeUseCase = (
  provider: ThemeProviderPort,
  repository: ThemeRepositoryPort,
  logger: Logger,
): ThemeUseCase => {
  const getThemes = async (filters: ThemeFilters): Promise<Theme[]> => {
    const themes = await provider.getThemes(filters)

    if (themes.length > 0) {
      void repository.saveMany(themes).catch((error) => {
        logger.error('Failed to save themes batch', { count: themes.length, error })
      })
    }

    return themes
  }

  return { getThemes }
}
