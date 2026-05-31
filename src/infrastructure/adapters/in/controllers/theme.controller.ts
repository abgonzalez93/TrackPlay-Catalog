import { ThemeFiltersSchema } from '@trackplay/catalog-domain'
import { HTTP_STATUS, validateSchema } from '@trackplay/core'
import type { TrackPlayRequest, TrackPlayResponse } from '@trackplay/runtime'
import { type ThemeUseCase } from '#useCases/theme.usecase'

export interface ThemeController {
  getThemes(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
}

export const themeController = (themeUseCase: ThemeUseCase): ThemeController => {
  const getThemes = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const filters = validateSchema(ThemeFiltersSchema, req.query, { i18nKey: 'catalog.filters.invalid_format' })
    const themes = await themeUseCase.getThemes(filters)
    res.status(HTTP_STATUS.OK).json(themes)
  }

  return {
    getThemes,
  }
}
