import { required, getServerConf } from '@trackplay/core/config'

/**
 * Environment configuration.
 *
 * Centralized access to all environment variables used in the application,
 * including runtime flags and required external service credentials.
 *
 * Each variable is either loaded directly from `process.env`, has a default fallback,
 * or is enforced as required using the `required` function.
 *
 * @module config
 */
export const getConf = () => ({
  ...getServerConf(),
  IGDB_TOKEN_URL: required('IGDB_TOKEN_URL'),
  IGDB_API_URL: required('IGDB_API_URL'),
  IGDB_CLIENT_ID: required('IGDB_CLIENT_ID'),
  IGDB_CLIENT_SECRET: required('IGDB_CLIENT_SECRET'),
})
