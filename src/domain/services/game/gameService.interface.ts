import { Game, GameFilters, GameList, Id } from '@trackplay/core/schemas'

/**
 * **GameService (interface)**
 *
 * Application-layer contract defining **how game data is retrieved**
 * within the domain.
 *
 * Serves as an intermediary between {@link GameUseCase} and the
 * infrastructure-level {@link GamePort}, encapsulating business-oriented
 * retrieval logic.
 *
 * ### Scope
 * - Exposes operations for searching and retrieving {@link Game} entities.
 * - Provides a unified contract independent of external data providers.
 *
 * ### Semantics
 * - Returns normalized and validated {@link Game} entities or lists.
 * - Implementations handle delegation to provider-specific ports.
 */
export interface GameService {
  /**
   * Searches for games using the specified domain-level filters.
   *
   * @param filters - Criteria used to filter the game collection.
   * @returns A promise resolving to a {@link GameList} of matching games.
   */
  searchGames(filters: GameFilters): Promise<GameList>

  /**
   * Retrieves a single game by its unique identifier.
   *
   * @param id - The domain-level {@link Id} of the game.
   * @returns A promise resolving to a {@link Game} if found, or `null` otherwise.
   */
  getGameById(id: Id): Promise<Game | null>
}
