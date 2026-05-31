import { getSecrets, getServerEnv, BaseServerEnvSchema } from '@trackplay/core'
import { CatalogSecretsSchema } from '#schemas/config.schema'

const { ENVIRONMENT } = getServerEnv(BaseServerEnvSchema.pick({ ENVIRONMENT: true }))
const isDevelopment = ENVIRONMENT === 'development'

const { DATABASE_URL } = getSecrets(CatalogSecretsSchema, { isDevelopment })

export { DATABASE_URL }
