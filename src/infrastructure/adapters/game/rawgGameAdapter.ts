import { Id, Game, GameList, GameFilters } from '@trackplay/core/schemas'
import { AuthPort, GamePort } from '@trackplay/core/ports'

export const rawgGameAdapter = (_authPort: AuthPort, _apiUrl: string): GamePort => {
  const searchGames = async (_filters: GameFilters): Promise<GameList> => []

  const getGameById = async (_id: Id): Promise<Game | null> => null

  return {
    searchGames,
    getGameById,
  }
}
