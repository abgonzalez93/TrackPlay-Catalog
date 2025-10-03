import { Game, GameFilters, GameList, Id } from '@trackplay/core/schemas'

/**
 * **GameUseCase (interface)**
 *
 * Application-layer contract defining **what operations** are available
 * for interacting with {@link Game} entities in a **provider-agnostic** manner.
 *
 * ### Scope
 * - Declares operations for searching and retrieving games.
 * - Guarantees that all returned entities are normalized domain objects.
 *
 * ### Semantics
 * - Methods must return validated {@link Game} or {@link GameList} data.
 * - Implementations handle provider selection, mapping, and error propagation.
 */
export interface GameUseCase {
  /**
   * Searches for games matching the given criteria.
   *
   * @param filters - Domain-level filters to apply when querying games.
   * @returns A promise resolving to a {@link GameList} of matching games.
   */
  searchGames(filters: GameFilters): Promise<GameList>

  /**
   * Retrieves a single game by its unique identifier.
   *
   * @param id - The domain-level {@link Id} of the game to retrieve.
   * @returns A promise resolving to a {@link Game} entity if found.
   * @throws NotFoundError If no game exists for the specified identifier.
   */
  getGameById(id: Id): Promise<Game>
}
