import { Game, GameFilters } from '@trackplay/core/schemas'
import { GameProvider } from '@trackplay/core/providers'
import { toGame, toIGDBFilters } from '@mappers/index'
import { igdbGameService } from '@services/index'

/**
 * IGDB Game Provider
 *
 * Implements the GameProvider interface to interact with the IGDB API.
 * This adapter transforms neutral GameFilters into IGDB-specific filters,
 * fetches game data from IGDB via the igdbService, and validates the results
 * against the neutral `Game` schema before returning them to the application.
 *
 */
export const igdbProvider: GameProvider = {
  /**
   * Search for games on IGDB using neutral filters.
   *
   * @param {GameFilters} filters - Neutral filtering options for searching games.
   * @returns {Promise<Game[]>} A promise resolving to an array of validated Game objects.
   */
  searchGames: async (filters: GameFilters): Promise<Game[]> => {
    const igdbFilters = toIGDBFilters(filters)
    const games = await igdbGameService.searchGames(igdbFilters)
    return games.map(toGame)
  },

  /**
   * Retrieve a single game from IGDB by its numeric ID.
   *
   * @param {number} id - Numeric ID of the game in IGDB.
   * @returns {Promise<Game>} A promise resolving to the validated Game object.
   */
  getGameById: async (id: number): Promise<Game> => {
    const game = await igdbGameService.getGameById(id)
    return toGame(game)
  },
}
