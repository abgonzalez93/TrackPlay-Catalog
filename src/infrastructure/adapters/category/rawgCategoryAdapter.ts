import { AuthPort, CategoryPort } from '@trackplay/core/ports'
import { CategoryList } from '@trackplay/core/schemas'

export const rawgCategoryAdapter = (_authPort: AuthPort, _apiUrl: string): CategoryPort => {
  const getGenres = async (): Promise<CategoryList> => []

  const getPlatforms = async (): Promise<CategoryList> => []

  const getThemes = async (): Promise<CategoryList> => []

  return {
    getGenres,
    getPlatforms,
    getThemes,
  }
}
