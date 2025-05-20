import js from '@eslint/js'
import globals from 'globals'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import prettier from 'eslint-config-prettier'
import babelParser from '@babel/eslint-parser'

const cleanGlobals = Object.fromEntries(
  Object.entries({
    ...globals.browser,
    ...globals.es2021,
    ...globals.node,
  }).map(([key, value]) => [key.trim(), value])
)

export default [
  js.configs.recommended,
  {
    ...reactRecommended,
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: cleanGlobals,
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z]',
          argsIgnorePattern: '^_',
        },
      ],
      'react/jsx-uses-vars': 'error',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'public',
      '*.html',
      '*.css',
      '*.json',
      '.husky',
      '.prettierrc',
    ],
  },
  prettier,
]
