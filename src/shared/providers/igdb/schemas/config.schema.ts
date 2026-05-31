import { z } from 'zod'

const UrlSchema = z.url('Invalid URL format')

export const IgdbTokenUrlSchema = UrlSchema.refine((url) => url.includes('twitch.tv'), {
  error: 'IGDB Token URL must be a Twitch URL',
})

export const IgdbApiUrlSchema = UrlSchema.refine((url) => url.includes('igdb.com'), {
  error: 'IGDB API URL must be an IGDB URL',
})

export const IgdbClientIdSchema = z
  .string()
  .regex(/^[a-z0-9]{30}$/, { error: 'IGDB Client ID must be 30 alphanumeric characters' })

export const IgdbClientSecretSchema = z
  .string()
  .regex(/^[a-z0-9]{30}$/, { error: 'IGDB Client Secret must be 30 alphanumeric characters' })
