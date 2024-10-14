module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    ...require('globals').browser,
  },
  plugins: [
    'react',
    'react-hooks',
    'react-refresh',
  ],
  settings: {
    react: {
      version: '18.3',
    },
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    ...require('@eslint/js').configs.recommended.rules,
    ...require('eslint-plugin-react').configs.recommended.rules,
    ...require('eslint-plugin-react').configs['jsx-runtime'].rules,
    ...require('eslint-plugin-react-hooks').configs.recommended.rules,
    'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: [
          '**/vite.config.js',
          '**/*.test.js',
          '**/*.spec.js',
          '**/*.config.js',
          '**/*.config.cjs',
          '**/*.config.mjs',
        ],
        optionalDependencies: false,
        peerDependencies: false,
    }],
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'jsx-a11y/label-has-associated-control': 'off',
    'react/jsx-props-no-spreading': 'off',
    'max-len': 'off',
    'react/require-default-props': 'off',
  },
  ignorePatterns: ['dist'],
};
