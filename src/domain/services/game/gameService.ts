import { Game, GameFilters, GameList, Id } from '@trackplay/core/schemas'
import { GameService } from './gameService.interface'
import { GamePort } from '@trackplay/core/ports'

/**
 * **Game Service**
 *
 * Domain-level service that provides a business-oriented abstraction
 * over the underlying {@link GamePort}.
 *
 * This layer defines **how** game-related operations are executed,
 * orchestrating provider interactions and handling domain-specific
 * rules (e.g., null safety, filtering, normalization).
 *
 * ### Responsibilities
 * - Acts as the bridge between use cases and the infrastructure {@link GamePort}.
 * - Centralizes business logic for searching and retrieving games.
 * - Provides a consistent contract for accessing game data.
 *
 * @param gamePort - The infrastructure port responsible for communicating with the game provider.
 * @returns An implementation of the {@link GameService} interface exposing game operations.
 */
export const gameService = (gamePort: GamePort): GameService => {
  /**
   * Searches for games matching the provided filters.
   *
   * Delegates the call to the {@link GamePort}, ensuring that results
   * conform to the domain-level {@link GameList} contract.
   *
   * @param filters - The criteria used to filter games (e.g., genre, release date, platform).
   * @returns A {@link GameList} containing all games that satisfy the given filters.
   *
   * @throws {Error} If the underlying provider request fails or returns invalid data.
   */
  const searchGames = async (filters: GameFilters): Promise<GameList> => await gamePort.searchGames(filters)

  /**
   * Retrieves a single game by its unique identifier.
   *
   * Delegates the lookup to the {@link GamePort}. If the game does not exist,
   * the function returns `null` instead of throwing, leaving error handling
   * to the use case layer.
   *
   * @param id - The unique identifier of the game to retrieve.
   * @returns The {@link Game} entity if found, or `null` if no match exists.
   *
   * @throws {Error} If the provider request fails or data cannot be validated.
   */
  const getGameById = async (id: Id): Promise<Game | null> => await gamePort.getGameById(id)

  return {
    searchGames,
    getGameById,
  }
}
