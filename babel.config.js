module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
          '@database': './src/database',
          '@components': './app/components',
          '@navigation': './app/navigation',
          '@theme': './app/theme',
          '@utils': './app/utils',
          '@boot': './app/boot',
          '@screens': './app/screens',
          '@root': '.',
        },
      },
    ],
  ],
};
