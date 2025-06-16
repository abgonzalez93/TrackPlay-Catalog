import {
  NodeEnvSchema,
  IpAddressSchema,
  PortSchema,
  NonEmptyStringSchema,
  UrlStringSchema,
} from '@trackplay/core/schemas'
import { createEnv } from '@t3-oss/env-core'

export const getEnvConfig = createEnv({
  server: {
    NODE_ENV: NodeEnvSchema,

    HOST: IpAddressSchema,
    PORT: PortSchema,
    CORS_ORIGINS: NonEmptyStringSchema,

    IGDB_TOKEN_URL: UrlStringSchema,
    IGDB_API_URL: UrlStringSchema,
    IGDB_CLIENT_ID: NonEmptyStringSchema,
    IGDB_CLIENT_SECRET: NonEmptyStringSchema,
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
