import { GenreFiltersSchema } from '@trackplay/catalog-domain'
import { HTTP_STATUS, validateSchema } from '@trackplay/core'
import type { TrackPlayRequest, TrackPlayResponse } from '@trackplay/runtime'
import { type GenreUseCase } from '#useCases/genre.usecase'

export interface GenreController {
  getGenres(req: TrackPlayRequest, res: TrackPlayResponse): Promise<void>
}

export const genreController = (genreUseCase: GenreUseCase): GenreController => {
  const getGenres = async (req: TrackPlayRequest, res: TrackPlayResponse): Promise<void> => {
    const filters = validateSchema(GenreFiltersSchema, req.query, { i18nKey: 'catalog.filters.invalid_format' })
    const genres = await genreUseCase.getGenres(filters)
    res.status(HTTP_STATUS.OK).json(genres)
  }

  return {
    getGenres,
  }
}
