import { describe, it, expect, vi } from 'vitest'
import { createProviderMapper } from '#adapters-out/helpers/mappers/provider.mapper'
import { IGDBCompanySchema } from '#igdbSchemas/company.schema'
import { IGDBGameSchema } from '#igdbSchemas/game.schema'
import { IGDBPlatformSchema } from '#igdbSchemas/platform.schema'
import { type IGDBCompany } from '#igdbTypes/company.type'
import { type IGDBGame } from '#igdbTypes/game.type'
import { type IGDBPlatform } from '#igdbTypes/platform.type'
import { CompanySchema, GameSchema, PlatformSchema } from '@trackplay/catalog-domain'
import { ExternalServiceError, type Logger } from '@trackplay/core'

describe('createProviderMapper Integration Tests', () => {
  describe('Game Mapping', () => {
    const mapper = createProviderMapper(GameSchema)

    it('should map a complex IGDB game response to Domain Game entity', () => {
      const igdbMock: IGDBGame = {
        id: 12345,
        name: 'The Legend of Zelda: Breath of the Wild',
        slug: 'the-legend-of-zelda-breath-of-the-wild',
        summary: 'Step into a world of discovery...',
        storyline: 'Link wakes up...',
        first_release_date: 1488499200,
        total_rating: 95.5,
        cover: {
          id: 111,
          url: '//images.igdb.com/igdb/image/upload/t_thumb/cover.jpg',
        },
        genres: [
          { id: 1, name: 'Adventure', slug: 'adventure' },
          { id: 2, name: 'RPG', slug: 'rpg' },
        ],
        platforms: [
          { id: 6, name: 'PC', slug: 'pc' },
          { id: 130, name: 'Nintendo Switch', slug: 'switch' },
        ],
        involved_companies: [
          {
            id: 50,
            company: { id: 99, name: 'Nintendo', slug: 'nintendo' },
            developer: true,
            publisher: true,
          },
        ],
        websites: [{ id: 10, category: 1, url: 'http://zelda.com' }],
        videos: [{ id: 100, name: 'Trailer', video_id: 'yt_code_123' }],
      }

      IGDBGameSchema.parse(igdbMock)

      const domain = mapper.toDomain(igdbMock)

      expect(domain).toBeDefined()
      expect(domain?.id).toBe(12345)
      expect(domain?.name).toBe('The Legend of Zelda: Breath of the Wild')

      expect(domain?.totalRating).toBe(95.5)

      expect(domain?.cover).toEqual({
        id: 111,
        sm: 'https://images.igdb.com/igdb/image/upload/t_cover_small/cover.jpg',
        md: 'https://images.igdb.com/igdb/image/upload/t_cover_big/cover.jpg',
        lg: 'https://images.igdb.com/igdb/image/upload/t_1080p/cover.jpg',
      })

      expect(domain?.genres).toHaveLength(2)
      expect(domain?.genres?.[0].name).toBe('Adventure')

      expect(domain?.involvedCompanies).toHaveLength(1)
      expect(domain?.involvedCompanies?.[0].company?.name).toBe('Nintendo')
      expect(domain?.involvedCompanies?.[0].developer).toBe(true)

      expect(domain?.videos).toHaveLength(1)
      expect(domain?.videos?.[0].videoId).toBe('yt_code_123')
      expect(domain?.videos?.[0].name).toBe('Trailer')

      expect(domain?.websites).toHaveLength(1)
      expect(domain?.websites?.[0].url).toBe('http://zelda.com')
    })

    it('should map a list of games using toDomainList', () => {
      const igdbList: IGDBGame[] = [
        { id: 1, name: 'Game 1', slug: 'game-1' },
        { id: 2, name: 'Game 2', slug: 'game-2' },
      ]

      const domainList = mapper.toDomainList(igdbList)

      expect(domainList).toHaveLength(2)
      expect(domainList[0].name).toBe('Game 1')
      expect(domainList[1].id).toBe(2)
    })
  })

  describe('Company Mapping', () => {
    it('should map IGDB Company object to Domain Company (Image logic)', () => {
      const mapper = createProviderMapper(CompanySchema)
      const mockCompany: IGDBCompany = {
        id: 999,
        name: 'Valve',
        slug: 'valve',
        logo: {
          id: 55,
          url: '//images.igdb.com/igdb/image/upload/t_thumb/valve.jpg',
        },
      }

      IGDBCompanySchema.parse(mockCompany)
      const domain = mapper.toDomain(mockCompany)

      expect(domain?.id).toBe(999)
      expect(domain?.name).toBe('Valve')
      expect(domain?.logo).toEqual({
        id: 55,
        sm: 'https://images.igdb.com/igdb/image/upload/t_cover_small/valve.jpg',
        md: 'https://images.igdb.com/igdb/image/upload/t_cover_big/valve.jpg',
        lg: 'https://images.igdb.com/igdb/image/upload/t_1080p/valve.jpg',
      })
    })
  })

  describe('Platform Mapping', () => {
    it('should map IGDB Platform object to Domain Platform (Field mismatch edge case)', () => {
      const mapper = createProviderMapper(PlatformSchema)
      const mockPlatform: IGDBPlatform = {
        id: 48,
        name: 'PlayStation 4',
        slug: 'ps4',
        abbreviation: 'PS4',
        platform_logo: {
          id: 200,
          url: '//images.igdb.com/igdb/image/upload/t_thumb/ps4.jpg',
        },
      }

      IGDBPlatformSchema.parse(mockPlatform)
      const domain = mapper.toDomain(mockPlatform)

      expect(domain?.id).toBe(48)
      expect(domain?.name).toBe('PlayStation 4')
      expect(domain?.abbreviation).toBe('PS4')
      expect(domain?.logo).toBeUndefined()
    })
  })

  describe('Edge Cases & Defense Mechanisms', () => {
    const mapper = createProviderMapper(GameSchema)

    it('toDomain should throw ExternalServiceError if input is null', () => {
      expect(() => mapper.toDomain(null as any)).toThrow(ExternalServiceError)
    })

    it('toDomain should throw ExternalServiceError if input is undefined', () => {
      expect(() => mapper.toDomain(undefined as any)).toThrow(ExternalServiceError)
    })

    it('toDomainList should return empty array for non-array input', () => {
      const result = mapper.toDomainList('not an array' as any)
      expect(result).toEqual([])
    })

    it('toDomainList should skip null items in the array', () => {
      const result = mapper.toDomainList([null, { id: 1, name: 'Game 1', slug: 'game-1' }, undefined] as any)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Game 1')
    })

    it('toDomainList should log warnings for invalid items when logger is provided', () => {
      const logger = {
        warn: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
      } as unknown as Logger

      const result = mapper.toDomainList([{ id: 1, name: 'Valid Game', slug: 'valid' }, { invalid: true }] as any, logger)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Valid Game')
      expect(logger.warn).toHaveBeenCalledOnce()
      expect(logger.warn).toHaveBeenCalledWith(
        'Some items failed validation during mapping',
        expect.objectContaining({
          total: 2,
          failed: 1,
          successful: 1,
        }),
      )
    })

    it('toDomain should map minimal entity with only required fields', () => {
      const domain = mapper.toDomain({ id: 99, name: 'Minimal', slug: 'minimal' } as IGDBGame)

      expect(domain.id).toBe(99)
      expect(domain.name).toBe('Minimal')
      expect(domain.slug).toBe('minimal')
      expect(domain.genres).toBeUndefined()
      expect(domain.cover).toBeUndefined()
      expect(domain.summary).toBeUndefined()
    })
  })
})
