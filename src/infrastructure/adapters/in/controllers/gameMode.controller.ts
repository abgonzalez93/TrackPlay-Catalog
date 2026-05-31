import { GameModeFiltersSchema } from '@trackplay/catalog-domain'
import { HTTP_STATUS, validateSchema } from '@trackplay/core'
import type { TrackPlayRequest, TrackPlayResponse } from '@trackplay/runtime'
import { type GameModeUseCase } from '#useCases/gameMode.usecase'

export interface GameModeController {
  getGameModes(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
}

export const gameModeController = (gameModeUseCase: GameModeUseCase): GameModeController => {
  const getGameModes = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const filters = validateSchema(GameModeFiltersSchema, req.query, { i18nKey: 'catalog.filters.invalid_format' })
    const gameModes = await gameModeUseCase.getGameModes(filters)
    res.status(HTTP_STATUS.OK).json(gameModes)
  }

  return {
    getGameModes,
  }
}
