import type { Platform, PlatformFilters } from '@trackplay/catalog-domain'

export interface PlatformProviderPort {
  getPlatforms(filters: PlatformFilters): Promise<Platform[]>
}

export interface PlatformRepositoryPort {
  saveMany(platforms: Platform[]): Promise<void>
}
