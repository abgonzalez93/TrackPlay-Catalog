import type { FilterMap, GameFilters, FilterValue, FilterOperator, FilterCondition } from '@trackplay/catalog-domain'
import { BadRequestError } from '@trackplay/core'

type FieldMap<Field extends string> = Record<Field, string>
type FilterShortCondition = Partial<Record<FilterOperator, FilterValue>>
type FilterObject = FilterCondition | FilterShortCondition

const OPERATOR_MAP = {
  eq: '=',
  ne: '!=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  like: '~',
} as const

const VALID_FILTER_OPERATORS = new Set<string>([...Object.keys(OPERATOR_MAP), 'in', 'nin'])

const QUOTE_REGEX = /"/g
const ASTERISK_TRIM_REGEX = /^\*|\*$/g

const isField = <Field extends string>(key: string, map: FieldMap<Field>): key is Field => key in map
const isOperator = (key: string): key is keyof typeof OPERATOR_MAP => key in OPERATOR_MAP
const isValidFilterOperator = (key: string): boolean => VALID_FILTER_OPERATORS.has(key)
const isFilterCondition = (filter: FilterObject): filter is FilterCondition => 'operator' in filter && 'value' in filter
const isExpandedField = (value: string): boolean => value.includes(',')
const escapeString = (val: string): string => val.replace(QUOTE_REGEX, '\\"')

const formatValue = (value: FilterValue): string => {
  if (value instanceof Date) return Math.floor(value.getTime() / 1000).toString()
  if (typeof value === 'string') return `"${escapeString(value)}"`
  return String(value)
}

const formatValueList = (values: FilterValue | FilterValue[]): string => {
  return Array.isArray(values) ? values.map(formatValue).join(',') : formatValue(values)
}

const buildInNotInCondition = (field: string, operator: 'in' | 'nin', value: FilterValue | FilterValue[]): string => {
  const op = operator === 'in' ? '=' : '!='
  return `${field} ${op} (${formatValueList(value)})`
}

const buildLikeCondition = (field: string, value: string): string => {
  let finalValue = value
  let prefix = '*'
  let suffix = '*'

  if (value.startsWith('*') || value.endsWith('*')) {
    prefix = value.startsWith('*') ? '*' : ''
    suffix = value.endsWith('*') ? '*' : ''
    finalValue = value.replace(ASTERISK_TRIM_REGEX, '')
  }

  return `${field} ~ ${prefix}${formatValue(finalValue)}${suffix}`
}

const buildSimpleCondition = (field: string, operator: string, value: FilterValue | FilterValue[]): string => {
  return `${field} ${operator} ${formatValueList(value)}`
}

const buildCondition = (field: string, operator: string, value: FilterValue | FilterValue[]): string => {
  if (operator === 'in' || operator === 'nin') {
    return buildInNotInCondition(field, operator, value)
  }

  const mappedOp = isOperator(operator) ? OPERATOR_MAP[operator] : '='

  if (mappedOp === '~' && typeof value === 'string') {
    return buildLikeCondition(field, value)
  }

  return buildSimpleCondition(field, mappedOp, value)
}

const processFilterObject = (field: string, filter: FilterObject): string[] => {
  const conditions: string[] = []

  if (isFilterCondition(filter)) {
    conditions.push(buildCondition(field, filter.operator, filter.value))
    return conditions
  }

  for (const [opKey, opVal] of Object.entries(filter)) {
    if (opVal === undefined) continue
    if (isValidFilterOperator(opKey)) {
      conditions.push(buildCondition(field, opKey, opVal))
    }
  }
  return conditions
}

const processFilterEntry = (field: string, filter: FilterValue | FilterObject | undefined): string[] => {
  if (filter === undefined || filter === null) return []

  if (Array.isArray(filter)) {
    return [buildCondition(field, 'in', filter)]
  }

  if (filter instanceof Date) {
    return [buildCondition(field, 'eq', filter)]
  }

  if (typeof filter === 'object') {
    return processFilterObject(field, filter)
  }

  return [buildCondition(field, 'eq', filter)]
}

const buildWhereClause = <Field extends string>(
  filters: FilterMap | undefined,
  fieldMap: FieldMap<Field>,
): string | undefined => {
  if (!filters) return undefined
  const conditions: string[] = []

  for (const [key, filter] of Object.entries(filters)) {
    if (!isField(key, fieldMap)) continue

    const mappedVal = fieldMap[key]
    if (isExpandedField(mappedVal)) continue

    conditions.push(...processFilterEntry(mappedVal, filter))
  }

  return conditions.length ? conditions.join(' & ') : undefined
}

const getMappedFields = <Field extends string>(fieldMap: FieldMap<Field>, fields?: Field[]): string => {
  const selectedFields = fields
    ? fields.map((f) => fieldMap[f].trim())
    : Object.values<string>(fieldMap).map((f) => f.trim())
  return `fields ${selectedFields.join(', ')};`
}

const getSearchClause = (
  search: string | undefined,
  finalWhere: string | undefined,
): { clause?: string; whereUpdate?: string } => {
  if (!search) return {}

  const escapedSearch = escapeString(search)

  if (finalWhere) {
    const searchCondition = `name ~ *"${escapedSearch}"*`
    return { whereUpdate: `(${finalWhere}) & ${searchCondition}` }
  }

  return { clause: `search "${escapedSearch}";` }
}

const getSortClause = <Field extends string>(
  sortBy: string | undefined,
  sortOrder: string | undefined,
  fieldMap: FieldMap<Field>,
): string | undefined => {
  if (sortBy && isField(sortBy, fieldMap)) return `sort ${fieldMap[sortBy]} ${sortOrder};`
  return undefined
}

interface IGDBQueryBuilderOptions<Field extends string> extends Partial<GameFilters> {
  where?: string
  fields?: Field[]
  filters?: FilterMap
}

export type BuildIGDBQuery = <Field extends string>(
  fieldMap: FieldMap<Field>,
  options: IGDBQueryBuilderOptions<Field>,
) => string

export const buildIGDBQuery: BuildIGDBQuery = (fieldMap, options) => {
  const { query: search, sortBy, sortOrder, limit, offset, where, fields } = options

  if (search && sortBy) {
    throw new BadRequestError({
      i18nKey: 'catalog.filters.search_sort_conflict',
      i18nArgs: { sortBy },
    })
  }

  const clauses: string[] = []
  clauses.push(getMappedFields(fieldMap, fields))

  const generatedWhere = buildWhereClause(options.filters, fieldMap)
  let finalWhere = [where, generatedWhere].filter(Boolean).join(' & ')

  const { clause: searchClause, whereUpdate } = getSearchClause(search, finalWhere)

  if (whereUpdate) finalWhere = whereUpdate
  if (searchClause) clauses.push(searchClause)
  if (finalWhere) clauses.push(`where ${finalWhere};`)

  const sortClause = getSortClause(sortBy, sortOrder, fieldMap)
  if (sortClause) clauses.push(sortClause)

  if (limit) clauses.push(`limit ${limit};`)
  if (offset) clauses.push(`offset ${offset};`)

  return clauses.join('\n')
}
