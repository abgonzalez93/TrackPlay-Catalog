import { PlatformFiltersSchema } from '@trackplay/catalog-domain'
import { HTTP_STATUS, validateSchema } from '@trackplay/core'
import type { TrackPlayRequest, TrackPlayResponse } from '@trackplay/runtime'
import { type PlatformUseCase } from '#useCases/platform.usecase'

export interface PlatformController {
  getPlatforms(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
}

export const platformController = (platformUseCase: PlatformUseCase): PlatformController => {
  const getPlatforms = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const filters = validateSchema(PlatformFiltersSchema, req.query, { i18nKey: 'catalog.filters.invalid_format' })
    const platforms = await platformUseCase.getPlatforms(filters)
    res.status(HTTP_STATUS.OK).json(platforms)
  }

  return {
    getPlatforms,
  }
}
