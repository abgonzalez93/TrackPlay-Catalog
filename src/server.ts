import { bootstrap } from '@trackplay/core/server'
import { getEnvConfig } from '@config/index'
import { routes } from '@routes/index'

/**
 * Entry point for the TrackPlay Catalog service.
 *
 * This file delegates the bootstrapping process to the shared {@link bootstrap}
 * function provided by `@trackplay/core/server`, ensuring consistency across
 * all TrackPlay services.
 *
 * Responsibilities:
 * - Loads environment configuration via {@link getEnvConfig}.
 * - Registers service-specific routes defined in {@link routes}.
 * - Passes the service name ("TrackPlay-Catalog") for logging and monitoring.
 * - Starts the HTTP/HTTPS server with the provided configuration.
 *
 */
await bootstrap({
  serviceName: 'TrackPlay-Catalog',
  routes,
  env: getEnvConfig,
})
