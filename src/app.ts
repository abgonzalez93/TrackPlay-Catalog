import { applyMiddlewares, errorHandler } from '@trackplay/core/middlewares'
import { getConfig } from '@config/index'
import { routes } from '@routes/index'
import express from 'express'

/**
 * Main Express application setup.
 *
 * @module app
 */
const app = express()

const { CORS_ORIGINS } = getConfig()

applyMiddlewares(app, {
  cors: {
    origin: CORS_ORIGINS.split(','),
    credentials: true,
  },
})

routes(app)
app.use(errorHandler)

export default app
