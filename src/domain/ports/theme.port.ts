import type { Theme, ThemeFilters } from '@trackplay/catalog-domain'

export interface ThemeProviderPort {
  getThemes(filters: ThemeFilters): Promise<Theme[]>
}

export interface ThemeRepositoryPort {
  saveMany(themes: Theme[]): Promise<void>
}
