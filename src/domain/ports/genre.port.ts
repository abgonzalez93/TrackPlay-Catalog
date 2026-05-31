import type { Genre, GenreFilters } from '@trackplay/catalog-domain'

export interface GenreProviderPort {
  getGenres(filters: GenreFilters): Promise<Genre[]>
}

export interface GenreRepositoryPort {
  saveMany(genres: Genre[]): Promise<void>
}
