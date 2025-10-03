import { Category } from '@trackplay/core/schemas'
import { IGDBCategory } from '@schemas/index'

/**
 * **toCategory**
 *
 * Maps an IGDB-specific {@link IGDBCategory} entity into a domain-neutral {@link Category}.
 *
 * ### Scope
 * - Serves as a transformation layer between the infrastructure (provider) and domain layers.
 * - Ensures consistent, provider-agnostic category representation.
 *
 * ### Mapping
 * - `id` → Directly copied from IGDB entity.
 * - `name` → Defaults to `"Unknown"` if missing.
 * - `slug` → Defaults to empty string if undefined.
 *
 * ### Notes
 * - Guarantees that the resulting {@link Category} object always has defined fields.
 * - Used by adapters such as {@link igdbCategoryAdapter} to normalize IGDB responses.
 *
 * @param entity - The raw IGDB category entity to transform.
 * @returns A normalized {@link Category} entity safe for domain use.
 */
export const toCategory = (entity: IGDBCategory): Category => {
  return {
    id: entity.id,
    name: entity.name ?? 'Unknown',
    slug: entity.slug ?? '',
  }
}
