module.exports = {
    testEnvironment: 'node',
    'roots': [
        '<rootDir>/tests'
    ],
    'testMatch': [
        '**/__tests__/**/*.+(ts|tsx)',
        '**/?(*.)+(spec|test).+(ts|tsx)'
    ],
    'transform': {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
}
