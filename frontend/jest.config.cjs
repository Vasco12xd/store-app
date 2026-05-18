module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/jest.setup.cjs'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^../../services/api$': '<rootDir>/__mocks__/api.js',
    '^../../../services/api$': '<rootDir>/__mocks__/api.js',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/App.tsx',
    '!src/app/store.ts',
    '!src/router/**',
    '!src/services/**',
    '!src/shared/hooks/**',
    '!src/**/*.d.ts',
  ],
};