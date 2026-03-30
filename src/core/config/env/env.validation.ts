import { envConfig, originalEnv } from '@app/core/config/env/env.config'

const envValidation = (config: Record<string, unknown>) => {
  const parsed = originalEnv.safeParse(config)
  if (!parsed.success) throw new Error(parsed.error.message)

  return envConfig.parse(parsed.data)
}

export { envValidation }
