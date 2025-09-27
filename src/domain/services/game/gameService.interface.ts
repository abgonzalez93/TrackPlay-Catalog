import { Game, GameFilters, GameList, Id } from '@trackplay/core/schemas'

/**
 * Interface for the Game Service.
 *
 * Defines the contract for interacting with game-related business logic.
 * This service acts as an intermediary between Use Cases and the underlying GamePort.
 */
export interface GameService {
  /**
   * Searches for games based on the provided filters.
   *
   * @param filters - Criteria to filter the list of games.
   * @returns A list of games matching the filters.
   */
  searchGames(filters: GameFilters): Promise<GameList>

  /**
   * Retrieves a game by its unique identifier.
   *
   * @param id - Unique identifier of the game.
   * @returns The game if found, otherwise `null`.
   */
  getGameById(id: Id): Promise<Game | null>
}
