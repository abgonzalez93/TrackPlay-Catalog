import { describe, it, expect } from 'vitest'
import { buildIGDBQuery } from '#adapters-out/helpers/query/igdb.query'
import { BadRequestError } from '@trackplay/core'

const simpleFieldMap = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  releaseDate: 'first_release_date',
  totalRating: 'total_rating',
} as const

const expandedFieldMap = {
  ...simpleFieldMap,
  cover: 'cover.url, cover.image_id, cover.id',
  genres: 'genres.name, genres.slug, genres.id',
} as const

describe('buildIGDBQuery', () => {
  describe('fields clause', () => {
    it('should include all mapped fields by default', () => {
      const query = buildIGDBQuery(simpleFieldMap, {})

      expect(query).toBe('fields id, name, slug, first_release_date, total_rating;')
    })

    it('should include only selected fields when specified', () => {
      const query = buildIGDBQuery(simpleFieldMap, { fields: ['name', 'slug'] })

      expect(query).toBe('fields name, slug;')
    })

    it('should expand compound field mappings', () => {
      const query = buildIGDBQuery(expandedFieldMap, { fields: ['cover', 'name'] })

      expect(query).toBe('fields cover.url, cover.image_id, cover.id, name;')
    })
  })

  describe('where clause', () => {
    it('should build where from a raw where string', () => {
      const query = buildIGDBQuery(simpleFieldMap, { where: 'id = 123' })

      expect(query).toContain('where id = 123;')
    })

    it('should map domain field names to IGDB field names in filters', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: { operator: 'gte', value: 80 } },
      })

      expect(query).toContain('where total_rating >= 80;')
    })

    it('should combine raw where and generated filters', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        where: 'id != 0',
        filters: { name: 'Zelda' },
      })

      expect(query).toContain('where id != 0 & name = "Zelda";')
    })

    it('should ignore filter keys not in fieldMap', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { unknownField: 42 },
      })

      expect(query).not.toContain('where')
    })

    it('should ignore expanded fields in filters (not filterable)', () => {
      const query = buildIGDBQuery(expandedFieldMap, {
        filters: { cover: 123 },
      })

      expect(query).not.toContain('where')
    })

    it('should produce no where clause when filters object is empty', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: {},
      })

      expect(query).not.toContain('where')
    })
  })

  describe('filter operators', () => {
    it('should handle eq operator', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { name: { operator: 'eq', value: 'Zelda' } },
      })

      expect(query).toContain('name = "Zelda"')
    })

    it('should handle ne operator', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { name: { operator: 'ne', value: 'Zelda' } },
      })

      expect(query).toContain('name != "Zelda"')
    })

    it('should handle gt operator', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: { operator: 'gt', value: 90 } },
      })

      expect(query).toContain('total_rating > 90')
    })

    it('should handle gte operator', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: { operator: 'gte', value: 90 } },
      })

      expect(query).toContain('total_rating >= 90')
    })

    it('should handle lt operator', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: { operator: 'lt', value: 50 } },
      })

      expect(query).toContain('total_rating < 50')
    })

    it('should handle lte operator', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: { operator: 'lte', value: 50 } },
      })

      expect(query).toContain('total_rating <= 50')
    })

    it('should handle in operator with array', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: { operator: 'in', value: [80, 90, 100] } },
      })

      expect(query).toContain('total_rating = (80,90,100)')
    })

    it('should handle nin operator with array', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: { operator: 'nin', value: [10, 20] } },
      })

      expect(query).toContain('total_rating != (10,20)')
    })

    it('should handle like operator with default wildcards', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { name: { operator: 'like', value: 'zelda' } },
      })

      expect(query).toContain('name ~ *"zelda"*')
    })

    it('should handle like operator with explicit leading wildcard', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { name: { operator: 'like', value: '*zelda' } },
      })

      expect(query).toContain('name ~ *"zelda"')
    })

    it('should handle like operator with explicit trailing wildcard', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { name: { operator: 'like', value: 'zelda*' } },
      })

      expect(query).toContain('name ~ "zelda"*')
    })

    it('should handle like operator with both explicit wildcards', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { name: { operator: 'like', value: '*zelda*' } },
      })

      expect(query).toContain('name ~ *"zelda"*')
    })
  })

  describe('filter shorthand syntax', () => {
    it('should handle direct value as eq shorthand', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { name: 'Zelda' },
      })

      expect(query).toContain('name = "Zelda"')
    })

    it('should handle direct number value as eq shorthand', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: 95 },
      })

      expect(query).toContain('total_rating = 95')
    })

    it('should handle array value as in shorthand', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: [80, 90] },
      })

      expect(query).toContain('total_rating = (80,90)')
    })

    it('should handle Date value as eq with unix timestamp conversion', () => {
      const date = new Date('2023-01-01T00:00:00Z')
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { releaseDate: date },
      })

      const expectedTimestamp = Math.floor(date.getTime() / 1000)
      expect(query).toContain(`first_release_date = ${expectedTimestamp}`)
    })

    it('should handle short condition object with multiple operators', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: { gte: 70, lte: 100 } },
      })

      expect(query).toContain('total_rating >= 70')
      expect(query).toContain('total_rating <= 100')
    })

    it('should skip undefined values in short condition object', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: { gte: 70, lte: undefined } },
      })

      expect(query).toContain('total_rating >= 70')
      expect(query).not.toContain('<=')
    })

    it('should handle in/nin in short condition syntax', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: { in: [80, 90] } },
      })

      expect(query).toContain('total_rating = (80,90)')
    })
  })

  describe('multiple filters', () => {
    it('should join multiple filter conditions with &', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: {
          name: 'Zelda',
          totalRating: { operator: 'gte', value: 80 },
        },
      })

      expect(query).toContain('where name = "Zelda" & total_rating >= 80;')
    })
  })

  describe('search clause', () => {
    it('should generate search clause when no filters present', () => {
      const query = buildIGDBQuery(simpleFieldMap, { query: 'zelda' })

      expect(query).toContain('search "zelda";')
      expect(query).not.toContain('where')
    })

    it('should convert search to where condition when filters exist', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        query: 'zelda',
        filters: { totalRating: { operator: 'gte', value: 80 } },
      })

      expect(query).not.toContain('search')
      expect(query).toContain('where (total_rating >= 80) & name ~ *"zelda"*;')
    })

    it('should convert search to where condition when raw where exists', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        query: 'zelda',
        where: 'id != 0',
      })

      expect(query).not.toContain('search')
      expect(query).toContain('where (id != 0) & name ~ *"zelda"*;')
    })

    it('should escape quotes in search terms', () => {
      const query = buildIGDBQuery(simpleFieldMap, { query: 'zelda "breath"' })

      expect(query).toContain('search "zelda \\"breath\\"";')
    })
  })

  describe('sort clause', () => {
    it('should generate sort clause with mapped field', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        sortBy: 'totalRating',
        sortOrder: 'desc',
      })

      expect(query).toContain('sort total_rating desc;')
    })

    it('should ignore sortBy if field is not in fieldMap', () => {
      const extendedMap = { ...simpleFieldMap, extra: 'extra_field' } as const
      const query = buildIGDBQuery(extendedMap, {
        sortBy: 'extra' as any,
        sortOrder: 'asc',
      })

      expect(query).toContain('sort extra_field asc;')
    })

    it('should throw BadRequestError when search and sortBy are both provided', () => {
      expect(() =>
        buildIGDBQuery(simpleFieldMap, {
          query: 'zelda',
          sortBy: 'totalRating',
        }),
      ).toThrow(BadRequestError)
    })
  })

  describe('pagination', () => {
    it('should include limit clause', () => {
      const query = buildIGDBQuery(simpleFieldMap, { limit: 10 })

      expect(query).toContain('limit 10;')
    })

    it('should include offset clause', () => {
      const query = buildIGDBQuery(simpleFieldMap, { offset: 20 })

      expect(query).toContain('offset 20;')
    })

    it('should include both limit and offset', () => {
      const query = buildIGDBQuery(simpleFieldMap, { limit: 10, offset: 20 })

      expect(query).toContain('limit 10;')
      expect(query).toContain('offset 20;')
    })

    it('should not include limit or offset when not provided', () => {
      const query = buildIGDBQuery(simpleFieldMap, {})

      expect(query).not.toContain('limit')
      expect(query).not.toContain('offset')
    })
  })

  describe('value formatting', () => {
    it('should wrap strings in quotes', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { name: 'test' },
      })

      expect(query).toContain('"test"')
    })

    it('should escape double quotes in string values', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { name: 'say "hello"' },
      })

      expect(query).toContain('"say \\"hello\\""')
    })

    it('should not wrap numbers in quotes', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { totalRating: 95 },
      })

      expect(query).toContain('total_rating = 95')
      expect(query).not.toContain('"95"')
    })

    it('should convert Date to unix timestamp', () => {
      const date = new Date('2020-06-15T00:00:00Z')
      const query = buildIGDBQuery(simpleFieldMap, {
        filters: { releaseDate: { operator: 'gte', value: date } },
      })

      expect(query).toContain(`first_release_date >= ${Math.floor(date.getTime() / 1000)}`)
    })

    it('should handle boolean values', () => {
      const fieldMap = { ...simpleFieldMap, active: 'active' } as const
      const query = buildIGDBQuery(fieldMap, {
        filters: { active: true },
      })

      expect(query).toContain('active = true')
    })
  })

  describe('full query composition', () => {
    it('should compose all clauses in correct order', () => {
      const query = buildIGDBQuery(simpleFieldMap, {
        where: 'id != 0',
        filters: { totalRating: { operator: 'gte', value: 80 } },
        sortBy: 'totalRating',
        sortOrder: 'desc',
        limit: 10,
        offset: 5,
      })

      const lines = query.split('\n')
      expect(lines[0]).toMatch(/^fields /)
      expect(lines[1]).toMatch(/^where /)
      expect(lines[2]).toMatch(/^sort /)
      expect(lines[3]).toMatch(/^limit /)
      expect(lines[4]).toMatch(/^offset /)
    })

    it('should produce minimal query with no options', () => {
      const query = buildIGDBQuery(simpleFieldMap, {})

      expect(query).toBe('fields id, name, slug, first_release_date, total_rating;')
    })
  })
})
