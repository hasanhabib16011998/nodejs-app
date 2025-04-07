// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json',
      tsconfigRootDir: import.meta.dirname,
    },
  },
  files: ['**/*.ts'],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
  rules: {
    'no-console': 'warn',
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
  },
  ignores: ['node_modules', 'dist','migrations/**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintConfigPrettier,
  ],
});
