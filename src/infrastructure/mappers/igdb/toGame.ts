import { Game } from '@trackplay/core/schemas'
import { IGDBGame } from '@schemas/index'

/**
 * Maps an IGDB-specific game object (`IGDBGame`) into the neutral backend {@link Game} entity.
 *
 * Responsibilities:
 * - Normalizes raw provider-specific fields into domain-neutral ones.
 * - Converts Unix timestamps (`created_at`, `updated_at`, `first_release_date`) into JavaScript {@link Date} objects.
 * - Provides fallback values for optional fields (`null`, empty arrays, or defaults).
 * - Tags the entity with the provider identifier (`provider: "igdb"`).
 *
 * Notes:
 * - This function isolates IGDB's format from the rest of the application,
 *   ensuring that the backend only works with normalized {@link Game} objects.
 *
 * @param entity - The raw game object returned by the IGDB API.
 * @returns {Game} A domain-neutral `Game` entity ready for use within the application.
 *
 */

export const toGame = (entity: IGDBGame): Game => {
  return {
    providerIds: {
      igdb: entity.id,
    },
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
