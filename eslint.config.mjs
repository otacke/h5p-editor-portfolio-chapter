
import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  jsdoc.configs['flat/recommended'],
  {
    name: 'eslint-config-snordian-h5p',
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        H5P: 'readonly',
        H5PEditor: 'readonly',
        H5PIntegration: 'readonly'
      }
    },
    rules: {
      semi: ['error', 'always'],
      indent: ['error', 2, { 'SwitchCase': 1 }],
      'brace-style': ['error', 'stroustrup'],
      'keyword-spacing': ['error', { 'after': true }],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      'space-infix-ops': ['error', { 'int32Hint': false }],
      eqeqeq: ['error', 'smart'],
      'space-before-blocks': 'error',
      'space-before-function-paren': ['error', {
        'anonymous': 'always',
        'named': 'never',
        'asyncArrow': 'always'
      }],
      'no-extra-boolean-cast': 'off',
      'no-console': ['error', { 'allow': ['warn', 'error'] }],
      quotes: ['error', 'single'],
      'arrow-parens': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'no-alert': ['error'],
    },
    plugins: {
      jsdoc
    },
    settings: {
      jsdoc: {
        preferredTypes: {
          Function: 'function'
        }
      }
    }
  }
];
