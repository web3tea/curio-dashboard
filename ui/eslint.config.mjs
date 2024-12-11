import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import vuetify from 'eslint-plugin-vuetify'
import stylistic from '@stylistic/eslint-plugin'

export default typescriptEslint.config(
  { ignores: ['**/*.d.ts', '**/coverage', '**/dist'] },
  {
  plugins: {
      '@typescript-eslint': typescriptEslint.plugin,
      '@stylistic': stylistic,
  },
    extends: [
        eslint.configs.recommended,
        ...typescriptEslint.configs.recommended,
        ...eslintPluginVue.configs['flat/recommended'],
        ...vuetify.configs['flat/recommended']
    ],
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-template-shadow': ['error', { allow: ['result'] }],
        'vue/script-indent': ['error', 2, { baseIndent: 0 }],
        '@stylistic/semi': ["error", "never"],
        '@stylistic/object-curly-spacing': ["error", "always"]
    },
  },
  eslintConfigPrettier
);
