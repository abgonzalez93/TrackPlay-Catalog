import { defineConfig } from 'prisma/config'
import { DATABASE_URL } from '#config/db.config'

export default defineConfig({
  datasource: {
    url: DATABASE_URL,
  },
})
