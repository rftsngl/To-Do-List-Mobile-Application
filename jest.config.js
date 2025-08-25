module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@components/(.*)$': '<rootDir>/app/components/$1',
    '^@navigation/(.*)$': '<rootDir>/app/navigation/$1',
    '^@theme/(.*)$': '<rootDir>/app/theme/$1',
    '^@utils/(.*)$': '<rootDir>/app/utils/$1',
    '^@boot/(.*)$': '<rootDir>/app/boot/$1',
    '^@screens/(.*)$': '<rootDir>/app/screens/$1',
    '^@root/(.*)$': '<rootDir>/$1',
  },
};
