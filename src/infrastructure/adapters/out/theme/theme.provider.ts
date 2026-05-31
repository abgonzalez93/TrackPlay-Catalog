import { type Theme, type ThemeFilters, ThemeSchema } from '@trackplay/catalog-domain'
import { type Logger } from '@trackplay/core'
import { type IGDBFetch } from '../helpers/http/igdb.http.ts'
import { createProviderMapper } from '../helpers/mappers/provider.mapper.ts'
import { type BuildIGDBQuery } from '../helpers/query/igdb.query.ts'
import { ROUTES } from '#constants/routes.constant'
import { IGDB } from '#igdbConstants/igdb.constant'
import { IGDBThemeListSchema } from '#igdbSchemas/theme.schema'
import { type IGDBTheme } from '#igdbTypes/theme.type'
import { type ThemeProviderPort } from '#ports/theme.port'

const endpoint = ROUTES.IGDB.THEMES
const fields = IGDB.THEMES.FIELDS
const mapper = createProviderMapper<IGDBTheme, Theme>(ThemeSchema)

export const igdbThemeAdapter = (fetch: IGDBFetch, buildQuery: BuildIGDBQuery, logger: Logger): ThemeProviderPort => {
  const getThemes = async (filters: ThemeFilters): Promise<Theme[]> => {
    const query = buildQuery(fields, filters)

    const themes = await fetch({
      endpoint,
      query,
      schema: IGDBThemeListSchema,
    })

    return mapper.toDomainList(themes, logger)
  }

  return {
    getThemes,
  }
}
