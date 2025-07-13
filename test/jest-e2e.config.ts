import { join } from 'path';

import baseConfig from '../jest.config';

export default {
  ...baseConfig,
  rootDir: join(__dirname, '..'),
  testRegex: '.e2e-spec.ts$',
  testEnvironment: 'node',
  // 如果需要，也可以重写其他配置，比如覆盖 transform
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // 映射 src/ 别名路径，保持与 tsconfig.json 中 paths 一致
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
