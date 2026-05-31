import type { Id, Logger } from '@trackplay/core'
import { CACHE } from '#constants/cache.constant'

const STALE_THRESHOLD_MS = CACHE.STALE_THRESHOLD_HOURS * 60 * 60 * 1000

export const isStale = (lastSyncAt: Date, thresholdMs: number = STALE_THRESHOLD_MS): boolean => {
  return Date.now() - lastSyncAt.getTime() > thresholdMs
}

interface RevalidateOptions<T> {
  id: Id
  fetch: (id: Id) => Promise<T | null>
  save: (entity: T) => Promise<void>
  logger: Logger
  entityName: string
}

export const revalidateInBackground = <T>({ id, fetch, save, logger, entityName }: RevalidateOptions<T>): void => {
  void fetch(id)
    .then((fresh) => {
      if (fresh) {
        void save(fresh).catch((error) => {
          logger.error(`Failed to revalidate ${entityName}`, { id, error })
        })
      }
    })
    .catch((error) => {
      logger.warn(`Background revalidation failed for ${entityName}`, { id, error })
    })
}
