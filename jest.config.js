module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!**/node_modules/**',
    '!**/test/**',
    '!src/index.ts'
  ],
  reporters: ['default', 'jest-junit']
}
