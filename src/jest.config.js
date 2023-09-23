const config = {
  testMatch: ['**/*.jest.ts'],
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.jest.ts',
    '!**/*.e2d.ts',
    '!**/*.config.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/out/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.js',
    '!<rootDir>/coverage/**',
    '!<rootDir>/jest.config.js',
    '!<rootDir>/prisma/**',
    '!<rootDir>/minioStorage/**',
    '!<rootDir>/pages/**',
    '!<rootDir>/apiClient/**',
    '!<rootDir>/tests/**',
    '!<rootDir>/components/**',
    '!<rootDir>/context/**',
    '!<rootDir>/tools/**',
    '!<rootDir>/server/telefunc/**',
    '!<rootDir>/server/control/**',
    '!<rootDir>/server/service/interface.ts',
    '!<rootDir>/.dependency-cruiser.js',
    '!<rootDir>/palywright.config.ts'
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i': `<rootDir>/__mocks__/fileMock.js`,

    // Handle module aliases
    'server/(.*)$': '<rootDir>/server/$1',
    'prisma/prismaClient': '<rootDir>/prisma/prismaClient.ts',
    'minioStorage/minioClient': '<rootDir>/minioStorage/minioClient.ts',
    telefunc: '<rootDir>/TelefuncContext.d.ts'
  },
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  // testEnvironment: 'node',
  testEnvironment: '@quramy/jest-prisma/environment',
  testEnvironmentOptions: {
    verboseQuery: true
  },
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$']
}

module.exports = config
