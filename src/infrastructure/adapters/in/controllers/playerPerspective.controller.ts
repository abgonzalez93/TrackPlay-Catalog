import { PlayerPerspectiveFiltersSchema } from '@trackplay/catalog-domain'
import { HTTP_STATUS, validateSchema } from '@trackplay/core'
import type { TrackPlayRequest, TrackPlayResponse } from '@trackplay/runtime'
import { type PlayerPerspectiveUseCase } from '#useCases/playerPerspective.usecase'

export interface PlayerPerspectiveController {
  getPlayerPerspectives(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
}

export const playerPerspectiveController = (
  playerPerspectiveUseCase: PlayerPerspectiveUseCase,
): PlayerPerspectiveController => {
  const getPlayerPerspectives = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const filters = validateSchema(PlayerPerspectiveFiltersSchema, req.query, {
      i18nKey: 'catalog.filters.invalid_format',
    })

    const playerPerspectives = await playerPerspectiveUseCase.getPlayerPerspectives(filters)
    res.status(HTTP_STATUS.OK).json(playerPerspectives)
  }

  return {
    getPlayerPerspectives,
  }
}
