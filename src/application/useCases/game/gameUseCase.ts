import { Game, GameFilters, GameList, Id } from '@trackplay/core/schemas'
import { getTranslationPath } from '@trackplay/core/utils'
import { NotFoundError } from '@trackplay/core/errors'
import { GameUseCase } from './gameUseCase.interface'
import { GameService } from '@services/index'

const path = getTranslationPath(import.meta.url)

/**
 * **Game Use Case**
 *
 * Application-level orchestrator that defines how the system interacts with game data.
 *
 * This layer coordinates high-level operations (search, retrieval) while delegating
 * the actual logic to the injected {@link GameService}. It ensures that domain rules
 * and error handling are consistently applied across all game-related operations.
 *
 * ### Responsibilities
 * - Defines **what** actions can be performed with games (search, retrieve by ID).
 * - Delegates the **how** to {@link GameService}.
 * - Handles domain-specific exceptions (e.g., missing games).
 *
 * @param gameService - The domain service responsible for performing game-related data access.
 * @returns An implementation of the {@link GameUseCase} interface exposing game operations.
 */
export const gameUseCase = (gameService: GameService): GameUseCase => {
  /**
   * Searches for games matching the provided filters.
   *
   * @param filters - Criteria used to filter the game list (e.g., genres, release year, platform).
   * @returns A {@link GameList} containing all matching games.
   *
   * @throws {Error} If an error occurs while communicating with the underlying service or provider.
   */
  const searchGames = async (filters: GameFilters): Promise<GameList> => await gameService.searchGames(filters)

  /**
   * Retrieves a single game by its unique identifier.
   *
   * @param id - The unique identifier of the game to retrieve.
   * @returns The {@link Game} entity associated with the provided ID.
   *
   * @throws {NotFoundError} When no game exists for the given ID.
   */
  const getGameById = async (id: Id): Promise<Game> => {
    const game = await gameService.getGameById(id)
    if (!game) throw new NotFoundError(`${path}.game_not_found`)
    return game
  }

  return {
    searchGames,
    getGameById,
  }
}
