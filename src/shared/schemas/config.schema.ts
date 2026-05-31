import { z } from 'zod'
import { PROVIDERS } from '#constants/provider.constant'
import {
  IgdbApiUrlSchema,
  IgdbClientIdSchema,
  IgdbClientSecretSchema,
  IgdbTokenUrlSchema,
} from '#igdbSchemas/config.schema'

export const GameProviderSchema = z.enum(PROVIDERS.LIST).default(PROVIDERS.DEFAULT)

const DatabaseUrlSchema = z.url().refine((url) => url.startsWith('postgres://'), {
  error: 'DATABASE_URL must start with postgres://',
})

export const CatalogEnvSchema = z.object({
  GAME_PROVIDER: GameProviderSchema,
  IGDB_TOKEN_URL: IgdbTokenUrlSchema,
  IGDB_API_URL: IgdbApiUrlSchema,
})

export const CatalogSecretsSchema = z.object({
  IGDB_CLIENT_ID: IgdbClientIdSchema,
  IGDB_CLIENT_SECRET: IgdbClientSecretSchema,
  DATABASE_URL: DatabaseUrlSchema,
})
