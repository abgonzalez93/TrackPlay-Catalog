import { bootstrap } from '@trackplay/runtime'
import { container } from '#container/create.container'
import { registerRoutes } from '#routes/register.route'
import { CatalogEnvSchema, CatalogSecretsSchema } from '#schemas/config.schema'

await bootstrap({
  configure: (builder) =>
    builder
      .withConfig(CatalogEnvSchema, CatalogSecretsSchema)
      .withInfrastructure(container.infrastructure)
      .withApplication(container.application)
      .withInterface(container.interface)
      .withRoutes(registerRoutes),
})
