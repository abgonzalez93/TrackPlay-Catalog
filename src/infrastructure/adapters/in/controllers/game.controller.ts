import { GameFiltersSchema } from '@trackplay/catalog-domain'
import { HTTP_STATUS, IdSchema, validateSchema } from '@trackplay/core'
import type { TrackPlayRequest, TrackPlayResponse } from '@trackplay/runtime'
import { type GameUseCase } from '#useCases/game.usecase'

export interface GameController {
  getGames(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
  getGameById(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
}

export const gameController = (gameUseCase: GameUseCase): GameController => {
  const getGames = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const filters = validateSchema(GameFiltersSchema, req.query, { i18nKey: 'catalog.filters.invalid_format' })
    const games = await gameUseCase.getGames(filters)
    res.status(HTTP_STATUS.OK).json(games)
  }

  const getGameById = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const id = validateSchema(IdSchema, req.params.id, { i18nKey: 'catalog.games.invalid_id' })
    const game = await gameUseCase.getGameById(id)
    res.status(HTTP_STATUS.OK).json(game)
  }

  return {
    getGames,
    getGameById,
  }
}
