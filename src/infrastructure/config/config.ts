import { NodeEnvSchema, IpAddressSchema, PortSchema, NonEmptyStringSchema, UrlSchema } from '@trackplay/core/schemas'
import { createEnv } from '@t3-oss/env-core'

export const getEnvConfig = createEnv({
  server: {
    NODE_ENV: NodeEnvSchema,

    HOST: IpAddressSchema,
    PORT: PortSchema,
    CORS_ORIGINS: NonEmptyStringSchema,

    GAME_PROVIDER: NonEmptyStringSchema,

    IGDB_TOKEN_URL: UrlSchema,
    IGDB_API_URL: UrlSchema,
    IGDB_CLIENT_ID: NonEmptyStringSchema,
    IGDB_CLIENT_SECRET: NonEmptyStringSchema,

    RAWG_API_URL: UrlSchema,
    RAWG_API_KEY: NonEmptyStringSchema,
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
