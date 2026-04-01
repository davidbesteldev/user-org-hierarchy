import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

const config: Config.InitialOptions = {
  rootDir: './',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  maxWorkers: 1,
}

export default config
