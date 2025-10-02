import { Id, Game, GameList, GameFilters } from '@trackplay/core/schemas'
import { IGDBGameListSchema, IGDBGameSchema } from '@schemas/index'
import { getTranslationPath } from '@trackplay/core/utils'
import { ProviderTokenPort, GamePort } from '@trackplay/core/ports'
import { toGame, toIGDBFilters } from '@mappers/index'
import { withIGDBConfig } from '../helpers/index'
import { buildIGDBQuery } from '@queries/index'

const path = getTranslationPath(import.meta.url)
const endpoint = 'games'

/**
 * **IGDB Game Adapter**
 *
 * Infrastructure-level adapter that implements the {@link GamePort}
 * interface for retrieving and transforming game data from the IGDB API.
 *
 * This adapter defines **how** game data is queried, validated, and mapped
 * into domain-safe {@link Game} entities, ensuring that upper layers
 * operate only on normalized data structures.
 *
 * ### Responsibilities
 * - Translate domain-level {@link GameFilters} into IGDB query syntax.
 * - Execute authenticated API calls through {@link withIGDBConfig}.
 * - Validate responses using {@link IGDBGameListSchema} and {@link IGDBGameSchema}.
 * - Map raw API data into domain-level {@link Game} and {@link GameList} entities.
 *
 * ### Notes
 * - Uses POST requests written in IGDB Query Language (IGQL).
 * - Returns `null` when a requested game cannot be found.
 * - Operates strictly within the infrastructure layer, with no domain logic.
 *
 * @param authPort - The {@link ProviderTokenPort} providing access tokens for IGDB.
 * @param apiUrl - The base URL of the IGDB API.
 * @param clientId - The IGDB client identifier.
 * @returns An implementation of the {@link GamePort} interface for IGDB.
 */
export const igdbGameAdapter = (authPort: ProviderTokenPort, apiUrl: string, clientId: string): GamePort => {
  const igdb = withIGDBConfig(authPort, apiUrl, clientId, path)

  /**
   * Searches for games based on the given domain-level {@link GameFilters}.
   *
   * The method converts filters into IGDB-specific query syntax, builds
   * the final query using {@link buildIGDBQuery}, executes the API request,
   * and maps the validated response into a domain-safe {@link GameList}.
   *
   * @param filters - The filtering and sorting options defined at the domain level.
   * @returns A {@link GameList} containing all matching {@link Game} entities.
   *
   * @throws {Error} If the IGDB API request fails or response validation fails.
   */
  const searchGames = async (filters: GameFilters): Promise<GameList> => {
    const igdbFilters = toIGDBFilters(filters)
    const query = buildIGDBQuery(igdbFilters)

    return await igdb({
      endpoint,
      query,
      schema: IGDBGameListSchema,
      mapper: (games) => games.map(toGame),
    })
  }

  /**
   * Retrieves a single game by its unique domain-level {@link Id}.
   *
   * The method constructs a targeted IGDB query, validates the response
   * against {@link IGDBGameSchema}, and maps it into a {@link Game} entity.
   * If the game does not exist, `null` is returned.
   *
   * @param id - The unique domain identifier of the game.
   * @returns A {@link Game} entity if found, or `null` otherwise.
   *
   * @throws {Error} If the IGDB API request fails or response validation fails.
   */
  const getGameById = async (id: Id): Promise<Game | null> => {
    const query = buildIGDBQuery({ where: `id = ${id}` })

    return await igdb({
      endpoint,
      query,
      schema: IGDBGameSchema,
      mapper: (game) => (game ? toGame(game) : null),
    })
  }

  return {
    searchGames,
    getGameById,
  }
}
