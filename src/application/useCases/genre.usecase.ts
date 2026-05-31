import type { Genre, GenreFilters } from '@trackplay/catalog-domain'
import { type Logger } from '@trackplay/core'
import type { GenreProviderPort, GenreRepositoryPort } from '#ports/genre.port'

export interface GenreUseCase {
  getGenres(filters: GenreFilters): Promise<Genre[]>
}

export const genreUseCase = (
  provider: GenreProviderPort,
  repository: GenreRepositoryPort,
  logger: Logger,
): GenreUseCase => {
  const getGenres = async (filters: GenreFilters): Promise<Genre[]> => {
    const genres = await provider.getGenres(filters)

    if (genres.length > 0) {
      void repository.saveMany(genres).catch((error) => {
        logger.error('Failed to save genres batch', { count: genres.length, error })
      })
    }

    return genres
  }

  return {
    getGenres,
  }
}
