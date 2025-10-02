import { bootstrap } from '@trackplay/core/server'
import { getEnvConfig } from '@config/index'
import { routes } from '@routes/index'

/**
 * **TrackPlay Catalog — Service Entry Point**
 *
 * Initializes and launches the TrackPlay Catalog microservice.
 *
 * This file serves as the top-level composition root, delegating
 * the bootstrapping process to the shared {@link bootstrap} utility
 * provided by `@trackplay/core/server`. It ensures consistent startup
 * behavior across all TrackPlay services (Auth, Catalog, IGDB, etc.).
 *
 * ### Responsibilities
 * - Load and validate environment configuration via {@link getEnvConfig}.
 * - Register service-specific HTTP routes from {@link routes}.
 * - Pass identifying metadata (`serviceName`) for centralized logging, metrics, and monitoring.
 * - Initialize and start the HTTP/HTTPS server.
 *
 * ### Notes
 * - The {@link bootstrap} helper encapsulates middleware setup,
 *   error handling, localization, and server lifecycle management.
 * - This file should remain minimal — all initialization logic
 *   must be delegated to the shared `@trackplay/core` infrastructure.
 * - Executed once at service startup; intended as a single entry point.
 *
 * @see {@link bootstrap}
 * @see {@link getEnvConfig}
 * @see {@link routes}
 */
await bootstrap({
  serviceName: 'TrackPlay-Catalog',
  routes,
  env: getEnvConfig,
})
