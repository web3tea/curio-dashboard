import js from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import vuetify from 'eslint-plugin-vuetify'
import stylistic from '@stylistic/eslint-plugin'

export default ts.config(
    { ignores: ['**/*.d.ts', '**/coverage', '**/dist', '**/*.gitignore'], },
    js.configs.recommended,
    ts.configs.strict,
    ts.configs.stylistic,
    eslintPluginVue.configs['flat/recommended'],
    vuetify.configs['flat/recommended'],
    {
        files: ['**/*.{js,mjs,ts,mts,vue}'],
        plugins: {
            '@stylistic': stylistic,
        },
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser'
            }
        },
        rules: {
            "vue/script-indent": ["error", 2],
            '@stylistic/semi': ["error", "never"],
            '@stylistic/object-curly-spacing': ["error", "always"],
            '@stylistic/no-multiple-empty-lines': ['error', { "max": 1 }]
        }
    }
)
