import { AuthPort, CategoryPort } from '@trackplay/core/ports'
import { CategoryList } from '@trackplay/core/schemas'

export const rawgCategoryAdapter = (_authPort: AuthPort, _apiUrl: string): CategoryPort => ({
  getGenres: async (): Promise<CategoryList> => [],

  getPlatforms: async (): Promise<CategoryList> => [],

  getThemes: async (): Promise<CategoryList> => [],
})
