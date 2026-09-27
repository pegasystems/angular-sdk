import { globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';
import sonarjs from 'eslint-plugin-sonarjs';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import { defineConfig } from 'eslint/config';

const angularSourceFiles = ['src/app/**/*.ts'];
const customConstellationFiles = ['src/app/_components/custom-constellation/**/*.{js,jsx,ts,tsx}'];

export default defineConfig([
  globalIgnores([
    '**/node_modules',
    'dist/*',
    'lib/*',
    'src/auth.html',
    'src/authDone.js',
    '**/ext-libs.js',
    '**/*.json',
    '**/*.md',
    '**/*.svg',
    '**/*.d.ts',
    '**/*.mjs'
  ]),
  {
    languageOptions: {
      globals: {
        PCore: 'readonly',
        window: 'readonly',
        console: 'readonly',
        document: 'readonly',
        fetch: 'readonly'
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { project: 'tsconfig.json', ecmaFeatures: { jsx: true } }
    },
    settings: {
      'import/resolver': {
        typescript: {},
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        react: { version: 'detect' }
      },
      react: { version: 'detect' }
    },
    plugins: { sonarjs, import: importPlugin },
    rules: {
      'sonarjs/cognitive-complexity': ['warn', 20],
      'sonarjs/no-duplicate-string': 'off',
      'import/extensions': 'off',
      'import/named': 'off',
      'import/no-cycle': 'off',
      'import/no-duplicates': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
      'import/no-useless-path-segments': 'off',
      'import/order': 'off',
      'no-underscore-dangle': 'off',
      'no-restricted-syntax': 'warn',
      'import/no-relative-packages': 'off'
    }
  },
  {
    files: angularSourceFiles,
    ignores: customConstellationFiles,
    extends: [eslint.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic],
    processor: angularTemplate.processors['extract-inline-html'],
    plugins: { '@angular-eslint': angular, '@angular-eslint/template': angularTemplate },
    rules: {
      ...angular.configs.recommended.rules,
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', style: 'camelCase', prefix: ['app'] }],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', style: 'kebab-case', prefix: ['app', 'component', 'lib', 'mediaco', 'table', 'wss'] }
      ],
      '@angular-eslint/no-output-on-prefix': 'off',
      '@angular-eslint/use-lifecycle-interface': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-generic-constructors': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-console': 'off',
      'import/prefer-default-export': 'off'
    }
  },
  {
    files: ['src/app/**/*.html'],
    ignores: ['src/app/_components/custom-constellation/**'],
    languageOptions: { parser: angularTemplateParser },
    plugins: { '@angular-eslint/template': angularTemplate },
    rules: {
      ...angularTemplate.configs.recommended.rules,
      ...angularTemplate.configs.accessibility.rules,
      '@angular-eslint/template/prefer-control-flow': 'off',
      '@angular-eslint/template/eqeqeq': 'off',
      '@angular-eslint/template/alt-text': 'off',
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off'
    }
  },
  {
    files: customConstellationFiles,
    extends: [eslint.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic],
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      'react/jsx-filename-extension': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-fragments': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'jsx-a11y/alt-text': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-console': 'off',
      'import/prefer-default-export': 'off',
      'sonarjs/cognitive-complexity': ['warn', 45]
    }
  }
]);
