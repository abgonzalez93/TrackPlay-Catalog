export const IGDB = {
  COLLECTIONS: {
    FIELDS: {
      id: 'id',
      name: 'name',
      slug: 'slug',
    },
  },

  COMPANIES: {
    FIELDS: {
      id: 'id',
      name: 'name',
      slug: 'slug',
      logo: 'logo.url, logo.image_id, logo.id',
    },
  },

  GAMES: {
    FIELDS: {
      id: 'id',
      name: 'name',
      slug: 'slug',

      cover: 'cover.url, cover.image_id, cover.id',
      screenshots: 'screenshots.url, screenshots.image_id, screenshots.id',
      artworks: 'artworks.url, artworks.image_id, artworks.id',
      videos: 'videos.name, videos.video_id',

      websites: 'websites.category, websites.url, websites.trusted',
      externalGames: 'external_games.category, external_games.uid, external_games.url',

      releaseDate: 'first_release_date',
      totalRating: 'total_rating',

      summary: 'summary',
      storyline: 'storyline',

      gameType: 'game_type.type, game_type.id',
      genres: 'genres.name, genres.slug, genres.id',
      themes: 'themes.name, themes.slug, themes.id',
      gameModes: 'game_modes.name, game_modes.slug, game_modes.id',
      platforms:
        'platforms.name, platforms.slug, platforms.id, platforms.abbreviation, platforms.platform_logo.url, platforms.platform_logo.image_id, platforms.platform_logo.id',

      ageRatings:
        'age_ratings.organization.name, age_ratings.rating_category.rating, age_ratings.content_descriptions.description, age_ratings.id',
      gameEngines:
        'game_engines.name, game_engines.slug, game_engines.id, game_engines.logo.url, game_engines.logo.image_id, game_engines.logo.id',
      playerPerspectives: 'player_perspectives.name, player_perspectives.slug, player_perspectives.id',
      collection: 'collection.name, collection.slug, collection.id',

      involvedCompanies:
        'involved_companies.company.name, involved_companies.company.slug, involved_companies.company.id, involved_companies.company.logo.url, involved_companies.company.logo.image_id, involved_companies.company.logo.id, involved_companies.developer, involved_companies.publisher, involved_companies.porting, involved_companies.supporting',
      parentGame:
        'parent_game.name, parent_game.slug, parent_game.id, parent_game.cover.url, parent_game.cover.image_id, parent_game.cover.id',
      dlcs: 'dlcs.name, dlcs.slug, dlcs.id, dlcs.cover.url, dlcs.cover.image_id, dlcs.cover.id',
      expansions:
        'expansions.name, expansions.slug, expansions.id, expansions.cover.url, expansions.cover.image_id, expansions.cover.id',
      remakes: 'remakes.name, remakes.slug, remakes.id, remakes.cover.url, remakes.cover.image_id, remakes.cover.id',
      remasters:
        'remasters.name, remasters.slug, remasters.id, remasters.cover.url, remasters.cover.image_id, remasters.cover.id',
      similarGames:
        'similar_games.name, similar_games.slug, similar_games.id, similar_games.cover.url, similar_games.cover.image_id, similar_games.cover.id',
    },
  },

  GENRES: {
    FIELDS: {
      id: 'id',
      name: 'name',
      slug: 'slug',
    },
  },

  PLATFORMS: {
    FIELDS: {
      id: 'id',
      name: 'name',
      slug: 'slug',
      abbreviation: 'abbreviation',
      logo: 'platform_logo.url, platform_logo.image_id, platform_logo.id',
    },
  },

  THEMES: {
    FIELDS: {
      id: 'id',
      name: 'name',
      slug: 'slug',
    },
  },

  GAME_MODES: {
    FIELDS: {
      id: 'id',
      name: 'name',
      slug: 'slug',
    },
  },

  PLAYER_PERSPECTIVES: {
    FIELDS: {
      id: 'id',
      name: 'name',
      slug: 'slug',
    },
  },
} as const
