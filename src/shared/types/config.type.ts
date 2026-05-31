import { z } from 'zod'
import { CatalogEnvSchema, CatalogSecretsSchema } from '#schemas/config.schema'

export type CatalogEnv = z.infer<typeof CatalogEnvSchema>
export type CatalogSecrets = z.infer<typeof CatalogSecretsSchema>
