import { Game } from '@trackplay/core/schemas'
import { IGDBGame } from '@schemas/index'

/**
 * Maps an IGDB-specific game object (`IGDBGame`) into the neutral backend `Game` entity.
 *
 * - Converts Unix timestamps (`created_at`, `updated_at`, `first_release_date`) into JS Date objects.
 * - Ensures optional fields fallback to null or sensible defaults.
 *
 * @param entity - Raw game object from IGDB
 * @returns Normalized backend `Game` entity
 */
export const toGame = (entity: IGDBGame): Game => {
  return {
    igdb_id: entity.id,
    provider: 'igdb',
    title: entity.name ?? 'Unknown',
    slug: entity.slug ?? '',
    summary: entity.summary ?? null,
    storyline: entity.storyline ?? null,
    rating: entity.rating ?? null,
    aggregated_rating: entity.aggregated_rating ?? null,
    total_rating: entity.total_rating ?? null,
    hypes: entity.hypes ?? null,
    first_release_date: entity.first_release_date ? new Date(entity.first_release_date * 1000) : null,
    cover: entity.cover ?? null,
    genres: entity.genres ?? [],
    platforms: entity.platforms ?? [],
    themes: entity.themes ?? [],
    url: entity.url ?? null,
    updatedAt: entity.updated_at ? new Date(entity.updated_at * 1000) : undefined,
    createdAt: entity.created_at ? new Date(entity.created_at * 1000) : undefined,
  }
}
