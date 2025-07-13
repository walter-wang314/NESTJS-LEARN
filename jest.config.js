/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // 项目根目录，保持为 '.'，确保 <rootDir> 正确解析
  rootDir: '.',

  // 支持的文件后缀
  moduleFileExtensions: ['js', 'json', 'ts'],

  // 匹配测试文件（所有 .spec.ts 文件）
  testRegex: '.*\\.spec\\.ts$',

  // 使用 ts-jest 来转译 TypeScript 文件
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // 映射 src/ 别名路径，保持与 tsconfig.json 中 paths 一致
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  // 指定收集覆盖率的文件（只收集 src/ 下的 .ts 和 .js 文件）
  collectCoverageFrom: ['src/**/*.(t|j)s'],

  // 覆盖率输出目录
  coverageDirectory: './coverage',

  // 使用 Node 测试环境
  testEnvironment: 'node',

  // （可选）自动清理 mock
  clearMocks: true,

  // （可选）是否显示覆盖率报告（可以在 package.json 的 script 中加 --coverage 控制）
  // coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
