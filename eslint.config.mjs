import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

export default defineConfig([
  { ignores: ['**/dist/**', '**/.output/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  {
    files: ['packages/cli/**/*.{ts,js,mjs,cjs}'],
    rules: {
      'unicorn/no-process-exit': 0
    }
  },
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-empty-interface': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-unused-vars': 0,
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true }
      ],
      'no-undef': 0,
      'no-unused-expressions': 0,
      'unicorn/no-null': 0,
      'unicorn/filename-case': 0,
      'unicorn/consistent-function-scoping': 0,
      'unicorn/no-empty-file': 0,
      'unicorn/prefer-ternary': 0,
      'unicorn/prefer-single-call': 0,
      'unicorn/number-literal-case': 0,
      'unicorn/template-indent': 0,
      'unicorn/prevent-abbreviations': 0,
      'unicorn/no-await-expression-member': 0,
      'unicorn/no-useless-undefined': 0,
      'unicorn/prefer-string-replace-all': 0,
      'unicorn/no-abusive-eslint-disable': 0,
      'unicorn/import-style': 0,
      'unicorn/prefer-module': 0,
      'unicorn/prefer-string-raw': 0,
      'unicorn/prefer-top-level-await': 0
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2023
      }
    }
  }
])
