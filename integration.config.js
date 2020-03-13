module.exports = {
    testEnvironment: 'node',
    'roots': [
        '<rootDir>/tests/integration'
    ],
    'testMatch': [
        '**/__tests__/**/*.+(ts|tsx)',
        '**/?(*.)+(spec|test).+(ts|tsx)'
    ],
    'transform': {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    setupFilesAfterEnv: ['./tests/integration/setup.ts'],
}
