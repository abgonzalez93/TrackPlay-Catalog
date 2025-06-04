import { getBaseURL } from '@trackplay/core/utils'
import { logger } from '@trackplay/core/logger'
import { getConf } from '@config/index'
import app from './app'

const { PORT, HOST } = getConf()

/**
 * Entry point for the application.
 * Starts the HTTP server and logs startup info.
 *
 * @module server
 */
app.listen(PORT, HOST, () => {
  logger.info(`🚀 Server running at ${getBaseURL()}`)
})
