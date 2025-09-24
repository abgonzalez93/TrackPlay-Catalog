import { Category } from '@trackplay/core/schemas'
import { IGDBCategory } from '@schemas/index'

/**
 * Maps an IGDB-specific category entity into a domain-neutral {@link Category}.
 *
 * This function serves as a translation layer between the infrastructure layer
 * (provider-specific schemas like {@link IGDBCategory}) and the domain layer,
 * ensuring that the application works only with normalized data structures.
 *
 * @param entity - The raw IGDB category item to be transformed.
 * @returns {Category} A domain-neutral category item with normalized fields.
 *
 */
export const toCategory = (entity: IGDBCategory): Category => {
  return {
    id: entity.id,
    name: entity.name ?? 'Unknown',
    slug: entity.slug ?? '',
  }
}
