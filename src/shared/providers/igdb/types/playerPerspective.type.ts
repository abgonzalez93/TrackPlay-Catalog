import { z } from 'zod'
import { IGDBPlayerPerspectiveSchema } from '#igdbSchemas/playerPerspective.schema'

export type IGDBPlayerPerspective = z.infer<typeof IGDBPlayerPerspectiveSchema>
