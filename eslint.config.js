import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'

export default [
  {
    languageOptions: {
      parser: typescriptParser
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      'no-console': 'error',
      'no-unused-vars': 'error'
    },
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ignores: ['**/*.js']
  }
]
