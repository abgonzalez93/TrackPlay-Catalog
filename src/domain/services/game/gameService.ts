import { Game, GameFilters, GameList, Id } from '@trackplay/core/schemas'
import { GameService } from './gameService.interface'
import { GamePort } from '@trackplay/core/ports'

/**
 * Game Service
 *
 * Provides a higher-level abstraction over the {@link GamePort}.
 * Its primary role is to:
 * - Act as a bridge between Use Cases and the infrastructure layer.
 * - Centralize business logic for game operations.
 * - Handle scenarios such as missing entities or additional orchestration logic.
 *
 */
export const gameService = (gamePort: GamePort): GameService => {
  /**
   * Searches for games using the specified filters.
   * Delegates the call to the {@link GamePort}.
   */
  const searchGames = async (filters: GameFilters): Promise<GameList> => await gamePort.searchGames(filters)

  /**
   * Retrieves a game by its unique identifier.
   * Delegates the call to the {@link GamePort}.
   * Returns `null` if no game is found.
   */
  const getGameById = async (id: Id): Promise<Game | null> => await gamePort.getGameById(id)

  return {
    searchGames,
    getGameById,
  }
}
