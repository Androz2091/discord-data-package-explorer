import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteConfig from './svelte.config.js';

export default [
    { ignores: ['public/'] },
    js.configs.recommended,
    ...svelte.configs.recommended,
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        }
    },
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parserOptions: { svelteConfig }
        },
        rules: {
            // The lists are replaced whole, never reordered, and have no unique field: a key would add nothing,
            // and a duplicate one throws.
            'svelte/require-each-key': 'off'
        }
    },
    {
        plugins: { '@stylistic': stylistic },
        rules: {
            '@stylistic/indent': ['error', 4],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/quote-props': ['error', 'as-needed']
        }
    }
];
