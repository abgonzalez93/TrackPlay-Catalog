import { Id, Game, GameList, GameFilters } from '@trackplay/core/schemas'
import { AuthPort, GamePort } from '@trackplay/core/ports'

export const rawgGameAdapter = (_authPort: AuthPort, _apiUrl: string): GamePort => ({
  searchGames: async (_filters: GameFilters): Promise<GameList> => [],

  getGameById: async (_id: Id): Promise<Game | null> => null,
})
