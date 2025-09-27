import { Game, GameFilters, GameList, Id } from '@trackplay/core/schemas'

/**
 * Interface for the Game Use Case.
 *
 * Defines the application-level operations available for games.
 * Ensures provider-agnostic interaction with domain-neutral {@link Game} entities.
 */
export interface GameUseCase {
  /**
   * Searches for games based on the provided filters.
   *
   * @param filters - Criteria used to filter the list of games.
   * @returns A list of games matching the filters.
   */
  searchGames(filters: GameFilters): Promise<GameList>

  /**
   * Retrieves a game by its unique identifier.
   *
   * @param id - Unique identifier of the game.
   * @returns The game entity if found.
   * @throws NotFoundError - If no game is found for the given id.
   */
  getGameById(id: Id): Promise<Game>
}
