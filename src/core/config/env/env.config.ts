import { z } from 'zod'

import { zJson } from '@app/shared/utils/zod.util'

export const originalEnv = z.object({
  NODE_ENV: z
    .enum(['local', 'test', 'development', 'staging', 'production'])
    .default('test'),
  PORT: z.coerce.number().optional().default(3001),
  APP_NAME: z.string(),
  APP_VERSION: z.string(),
  DATABASE_URL: z.string().url(),
  ELASTICSEARCH_URL: z.string().url(),

  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: z.string().url(),
  OTEL_EXPORTER_OTLP_HEADERS: zJson(z.record(z.any())).default({}),
  OTEL_EXPORTER_PROMETHEUS_PORT: z.coerce.number().default(9464),
})

export const envConfig = originalEnv.transform((env) => ({
  app: {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    name: env.APP_NAME,
    version: env.APP_VERSION,
  },
  db: {
    url: env.DATABASE_URL,
  },
  o11y: {
    elasticSearchUrl: env.ELASTICSEARCH_URL,
  },
}))

export type OriginalEnv = z.infer<typeof originalEnv>
export type EnvConfig = z.infer<typeof envConfig>
