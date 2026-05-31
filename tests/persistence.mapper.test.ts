import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { createPersistenceMapper } from '#adapters-out/helpers/mappers/persistence.mapper'
import { PersistenceError } from '@trackplay/core'
import { Prisma, type Genre as PrismaGenre, type Platform as PrismaPlatform, type Game as PrismaGame } from '#prisma/client'
import { GenreSchema, type Genre, PlatformSchema, type Platform, type Game, GameSchema } from '@trackplay/catalog-domain'

type GameWithRelations = Prisma.GameGetPayload<{
  include: {
    collection: true
    genres: { include: { genre: true } }
    platforms: { include: { platform: true } }
    involvedCompanies: { include: { company: true } }
    themes: { include: { theme: true } }
    gameModes: { include: { gameMode: true } }
    playerPerspectives: { include: { playerPerspective: true } }
  }
}>

describe('createPersistenceMapper', () => {
  const now = new Date()

  describe('Integration Tests (Representative Entities)', () => {
    describe('Genre (Simple Entity: Scalars Only)', () => {
      const mapper = createPersistenceMapper<Genre, PrismaGenre>(GenreSchema)

      it('toPersistence should map correctly', () => {
        const domain: Genre = {
          id: 123,
          name: 'RPG',
          slug: 'rpg',
        }

        const persistence = mapper.toPersistence(domain)

        expect(persistence).toEqual({
          igdbId: 123,
          name: 'RPG',
          slug: 'rpg',
        })
      })

      it('toDomain should map correctly', () => {
        const persistence: PrismaGenre = {
          id: 1,
          igdbId: 123,
          name: 'RPG',
          slug: 'rpg',
          createdAt: now,
          updatedAt: now,
          lastSyncAt: now,
        }

        const domain = mapper.toDomain(persistence)

        expect(domain).toEqual({
          id: 123,
          name: 'RPG',
          slug: 'rpg',
        })
      })

      it('buildInclude should return undefined for entities without relations', () => {
        expect(mapper.buildInclude()).toBeUndefined()
      })
    })

    describe('Platform (Complex Entity: Optional Scalars + JSON Fields)', () => {
      const mapper = createPersistenceMapper<Platform, PrismaPlatform>(PlatformSchema)

      it('toPersistence should handle JSON fields (logo)', () => {
        const domain: Platform = {
          id: 50,
          name: 'PlayStation 5',
          slug: 'ps5',
          abbreviation: 'PS5',
          logo: {
            id: 500,
            sm: 'https://example.com/sm.jpg',
            md: 'https://example.com/md.jpg',
            lg: 'https://example.com/lg.jpg',
          },
        }

        const persistence = mapper.toPersistence(domain)

        expect(persistence).toMatchObject({
          igdbId: 50,
          name: 'PlayStation 5',
          slug: 'ps5',
          abbreviation: 'PS5',
          logo: {
            id: 500,
            sm: 'https://example.com/sm.jpg',
            md: 'https://example.com/md.jpg',
            lg: 'https://example.com/lg.jpg',
          },
        })
      })

      it('toPersistence should handle optional JSON fields as null', () => {
        const domain: Platform = {
          id: 51,
          name: 'NES',
          slug: 'nes',
          abbreviation: 'NES',
          logo: undefined,
        }

        const persistence = mapper.toPersistence(domain)

        expect(persistence.logo).toBe(Prisma.JsonNull)
      })

      it('toDomain should restore JSON fields', () => {
        const persistence: PrismaPlatform = {
          id: 99,
          igdbId: 50,
          name: 'PlayStation 5',
          slug: 'ps5',
          abbreviation: 'PS5',
          logo: {
            id: 500,
            sm: 'https://example.com/sm.jpg',
            md: 'https://example.com/md.jpg',
            lg: 'https://example.com/lg.jpg',
          },
          createdAt: now,
          updatedAt: now,
          lastSyncAt: now,
        }

        const domain = mapper.toDomain(persistence)

        expect(domain.logo).toEqual({
          id: 500,
          sm: 'https://example.com/sm.jpg',
          md: 'https://example.com/md.jpg',
          lg: 'https://example.com/lg.jpg',
        })
      })
    })

    describe('Game (Complex Entity: Relations, Dates, Large Structure)', () => {
      const mapper = createPersistenceMapper<Game, PrismaGame>(GameSchema, Prisma.GameScalarFieldEnum)

      const genre = { id: 12, name: 'RPG', slug: 'rpg' }
      const theme = { id: 13, name: 'Fantasy', slug: 'fantasy' }
      const gameMode = { id: 14, name: 'Single Player', slug: 'single-player' }
      const platform = { id: 15, name: 'PC', slug: 'pc' }
      const playerPerspective = { id: 9, name: 'First Person', slug: 'fps' }
      const collection = { id: 10, name: 'Collection', slug: 'collection' }
      const company = { id: 17, name: 'Comp', slug: 'comp' }

      const baseGamePersistence: GameWithRelations = {
        id: 1,
        igdbId: 1000,
        name: 'Test Game',
        slug: 'test-game',
        summary: null,
        storyline: null,
        releaseDate: null,
        totalRating: null,
        cover: null,
        screenshots: [],
        artworks: [],
        videos: [],
        websites: [],
        externalGames: [],
        ageRatings: [],
        gameEngines: [],
        gameType: null,
        parentGame: null,
        dlcs: [],
        expansions: [],
        remakes: [],
        remasters: [],
        similarGames: [],
        collectionId: null,
        collection: null,
        genres: [],
        platforms: [],
        involvedCompanies: [],
        themes: [],
        gameModes: [],
        playerPerspectives: [],
        createdAt: now,
        updatedAt: now,
        lastSyncAt: now,
      }

      describe('toPersistence', () => {
        it('should generate connectOrCreate for oneToOne relations (collection)', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
            collection,
          }

          const persistence = mapper.toPersistence(domain)

          expect(persistence.collection).toEqual({
            connectOrCreate: {
              where: { igdbId: 10 },
              create: { igdbId: 10, name: 'Collection', slug: 'collection' },
            },
          })
        })

        it('should generate create with connectOrCreate for simpleMany relations (genres, themes, etc)', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
            genres: [genre],
            themes: [theme],
          }

          const persistence = mapper.toPersistence(domain)

          expect(persistence.genres).toEqual({
            create: [
              {
                genre: {
                  connectOrCreate: {
                    where: { igdbId: 12 },
                    create: { igdbId: 12, name: 'RPG', slug: 'rpg' },
                  },
                },
              },
            ],
          })

          expect(persistence.themes).toEqual({
            create: [
              {
                theme: {
                  connectOrCreate: {
                    where: { igdbId: 13 },
                    create: { igdbId: 13, name: 'Fantasy', slug: 'fantasy' },
                  },
                },
              },
            ],
          })
        })

        it('should generate create with connectOrCreate for complexMany relations (involvedCompanies)', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
            involvedCompanies: [
              {
                id: 16,
                company,
                developer: true,
                publisher: false,
                porting: false,
                supporting: false,
              },
            ],
          }

          const persistence = mapper.toPersistence(domain)

          expect(persistence.involvedCompanies).toEqual({
            create: [
              {
                company: {
                  connectOrCreate: {
                    where: { igdbId: 17 },
                    create: { igdbId: 17, name: 'Comp', slug: 'comp' },
                  },
                },
                developer: true,
                publisher: false,
                porting: false,
                supporting: false,
              },
            ],
          })
        })

        it('should skip null/undefined relations', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
            collection: undefined,
            genres: undefined,
            involvedCompanies: undefined,
          }

          const persistence = mapper.toPersistence(domain)

          expect(persistence.collection).toBeUndefined()
          expect(persistence.genres).toBeUndefined()
          expect(persistence.involvedCompanies).toBeUndefined()
        })

        it('should skip empty array relations', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
            genres: [],
            themes: [],
            involvedCompanies: [],
          }

          const persistence = mapper.toPersistence(domain)

          expect(persistence.genres).toBeUndefined()
          expect(persistence.themes).toBeUndefined()
          expect(persistence.involvedCompanies).toBeUndefined()
        })

        it('should handle JSON scalar fields with null as Prisma.JsonNull', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
            cover: undefined,
            gameType: undefined,
          }

          const persistence = mapper.toPersistence(domain)

          expect(persistence.cover).toBe(Prisma.JsonNull)
          expect(persistence.gameType).toBe(Prisma.JsonNull)
        })

        it('should handle non-JSON nullable scalars as null', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
            summary: undefined,
            totalRating: undefined,
          }

          const persistence = mapper.toPersistence(domain)

          expect(persistence.summary).toBeNull()
          expect(persistence.totalRating).toBeNull()
        })
      })

      describe('forUpdate', () => {
        it('should add deleteMany before create for simpleMany relations', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
            genres: [genre],
          }

          const persistence = mapper.toPersistence(domain)
          const updated = mapper.forUpdate(persistence)

          expect(updated.genres).toEqual({
            deleteMany: {},
            create: [
              {
                genre: {
                  connectOrCreate: {
                    where: { igdbId: 12 },
                    create: { igdbId: 12, name: 'RPG', slug: 'rpg' },
                  },
                },
              },
            ],
          })
        })

        it('should add deleteMany before create for complexMany relations', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
            involvedCompanies: [{ id: 16, company, developer: true, publisher: false, porting: false, supporting: false }],
          }

          const persistence = mapper.toPersistence(domain)
          const updated = mapper.forUpdate(persistence)

          expect(updated.involvedCompanies).toHaveProperty('deleteMany')
          expect(updated.involvedCompanies).toHaveProperty('create')
        })

        it('should NOT add deleteMany for oneToOne relations', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
            collection,
          }

          const persistence = mapper.toPersistence(domain)
          const updated = mapper.forUpdate(persistence)

          expect(updated.collection).toEqual({
            connectOrCreate: {
              where: { igdbId: 10 },
              create: { igdbId: 10, name: 'Collection', slug: 'collection' },
            },
          })
        })

        it('should add deleteMany even when many relation is absent (cleanup stale data)', () => {
          const domain: Game = {
            id: 1000,
            name: 'Test Game',
            slug: 'test-game',
          }

          const persistence = mapper.toPersistence(domain)
          const updated = mapper.forUpdate(persistence)

          expect(updated.genres).toEqual({ deleteMany: {} })
          expect(updated.themes).toEqual({ deleteMany: {} })
          expect(updated.platforms).toEqual({ deleteMany: {} })
          expect(updated.gameModes).toEqual({ deleteMany: {} })
          expect(updated.playerPerspectives).toEqual({ deleteMany: {} })
          expect(updated.involvedCompanies).toEqual({ deleteMany: {} })
        })
      })

      describe('toDomain', () => {
        it('should reconstruct oneToOne relations from Prisma join structure', () => {
          const persistence: GameWithRelations = {
            ...baseGamePersistence,
            collectionId: 1,
            collection: {
              id: 1,
              igdbId: 10,
              name: 'Collection',
              slug: 'collection',
              createdAt: now,
              updatedAt: now,
              lastSyncAt: now,
            },
          }

          const domain = mapper.toDomain(persistence)

          expect(domain.collection).toEqual({ id: 10, name: 'Collection', slug: 'collection' })
        })

        it('should reconstruct simpleMany relations from Prisma join tables', () => {
          const persistence: GameWithRelations = {
            ...baseGamePersistence,
            genres: [
              {
                gameId: 1,
                genreId: 1,
                genre: { id: 1, igdbId: 12, name: 'RPG', slug: 'rpg', createdAt: now, updatedAt: now, lastSyncAt: now },
              },
            ],
            platforms: [
              {
                gameId: 1,
                platformId: 1,
                platform: {
                  id: 1,
                  igdbId: 15,
                  name: 'PC',
                  slug: 'pc',
                  abbreviation: null,
                  logo: null,
                  createdAt: now,
                  updatedAt: now,
                  lastSyncAt: now,
                },
              },
            ],
          }

          const domain = mapper.toDomain(persistence)

          expect(domain.genres).toEqual([{ id: 12, name: 'RPG', slug: 'rpg' }])
          expect(domain.platforms).toEqual([{ id: 15, name: 'PC', slug: 'pc' }])
        })

        it('should reconstruct complexMany relations from Prisma join tables', () => {
          const persistence: GameWithRelations = {
            ...baseGamePersistence,
            involvedCompanies: [
              {
                gameId: 1,
                companyId: 1,
                developer: true,
                publisher: false,
                porting: false,
                supporting: false,
                company: {
                  id: 1,
                  igdbId: 17,
                  name: 'Comp',
                  slug: 'comp',
                  logo: null,
                  createdAt: now,
                  updatedAt: now,
                  lastSyncAt: now,
                },
              },
            ],
          }

          const domain = mapper.toDomain(persistence)

          expect(domain.involvedCompanies).toEqual([
            {
              id: 17,
              company: { id: 17, name: 'Comp', slug: 'comp' },
              developer: true,
              publisher: false,
              porting: false,
              supporting: false,
            },
          ])
        })

        it('should convert null non-relation fields to undefined', () => {
          const persistence: GameWithRelations = {
            ...baseGamePersistence,
            summary: null,
            storyline: null,
            totalRating: null,
            releaseDate: null,
          }

          const domain = mapper.toDomain(persistence)

          expect(domain.summary).toBeUndefined()
          expect(domain.storyline).toBeUndefined()
          expect(domain.totalRating).toBeUndefined()
          expect(domain.releaseDate).toBeUndefined()
        })
      })

      describe('buildInclude', () => {
        it('should generate correct include structure for all relation types', () => {
          const include = mapper.buildInclude()

          expect(include).toEqual({
            collection: true,
            genres: { include: { genre: true } },
            platforms: { include: { platform: true } },
            themes: { include: { theme: true } },
            gameModes: { include: { gameMode: true } },
            playerPerspectives: { include: { playerPerspective: true } },
            involvedCompanies: { include: { company: true } },
          })
        })
      })
    })
  })

  describe('Edge Cases & Defense Mechanisms', () => {
    const SimpleSchema = z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
    })
    const mapper = createPersistenceMapper(SimpleSchema)

    it('toPersistence: should throw PersistenceError if domain input is null/undefined', () => {
      expect(() => mapper.toPersistence(undefined as any)).toThrow(PersistenceError)
      expect(() => mapper.toPersistence(null as any)).toThrow(PersistenceError)
    })

    it('toDomain: should throw PersistenceError if persistence input is null/undefined', () => {
      expect(() => mapper.toDomain(undefined as any)).toThrow(PersistenceError)
      expect(() => mapper.toDomain(null as any)).toThrow(PersistenceError)
    })

    it('toDomain: should correctly shadow internal DB ID with igdb ID (Domain ID)', () => {
      const persistence = {
        id: 999,
        igdbId: 1,
        name: 'Collision Test',
        slug: 'collision-test',
      }

      const domain = mapper.toDomain(persistence)
      expect(domain.id).toBe(1)
    })

    it('toDomain: should handle explicit NULLs when schema allows Nullable but NOT Optional', () => {
      const StrictNullableSchema = z.object({
        id: z.number(),
        name: z.string(),
        slug: z.string(),
        description: z.string().nullable(),
      })
      const strictMapper = createPersistenceMapper(StrictNullableSchema)

      const persistence = {
        igdbId: 10,
        name: 'Test',
        slug: 'test',
        description: null,
      }

      expect(() => strictMapper.toDomain(persistence)).toThrow(PersistenceError)
    })
  })
})
