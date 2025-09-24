import { Game, GameFilters, GameList, Id } from '@trackplay/core/schemas'
import { NotFoundError } from '@trackplay/core/errors'
import { gameAdapter } from '@adapters/index'

const path = 'catalog.application.useCases.gameUseCase'

/**
 * Game UseCase
 *
 * Provides application-level operations for interacting with games
 * in a provider-agnostic way. This layer orchestrates calls to the
 * GameAdapter and ensures that the application only works with
 * domain-neutral `Game` entities.
 */
export const gameUseCase = {
  /**
   * Searches for games using the provided domain-level filters.
   *
   * @param {GameFilters} filters - Neutral filtering options such as
   * title, platform, genre, or rating constraints.
   * @returns {Promise<GameList>} A list of games matching the filters.
   */
  searchGames: async (filters: GameFilters): Promise<GameList> => await gameAdapter.searchGames(filters),

  /**
   * Retrieves a single game by its domain-level identifier.
   *
   * @param {Id} id - The unique identifier of the game in the domain.
   * @returns {Promise<Game>} The game entity, if found.
   * @throws NotFoundError - If no game exists for the given identifier.
   */
  getGameById: async (id: Id): Promise<Game> => {
    const game = await gameAdapter.getGameById(id)
    if (!game) throw new NotFoundError(`${path}.game_not_found`)
    return game
  },
}
