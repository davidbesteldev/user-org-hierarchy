import { z } from 'zod'

export const zJson = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (val) => {
      if (typeof val === 'object' && val !== null) return val
      if (typeof val === 'string' && val.trim() !== '') {
        try {
          return JSON.parse(val)
        } catch {
          return '__INVALID_JSON__'
        }
      }

      return val
    },
    schema.refine((val) => val !== '__INVALID_JSON__', {
      message: 'Invalid JSON string',
    }),
  )
