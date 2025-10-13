// @ts-check
import eslint from '@eslint/js';
import { rules } from '@lmcd/eslint-config';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(eslint.configs.recommended, tseslint.configs.recommended, {
	// @ts-ignore
	rules: {
		...rules,
	},
	plugins: {
		'@stylistic': stylistic,
	},
	ignores: [
		'dist/',
		'node_modules/',
	],
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		globals: {
			...globals.node,
			...globals.browser,
			...globals.jest,
		},
	},
});
