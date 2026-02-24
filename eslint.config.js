// @ts-check
import eslint from '@eslint/js';
import { rules } from '@lmcd/eslint-config';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(globalIgnores([
	'dist/',
	'node_modules/',
]), eslint.configs.recommended, tseslint.configs.recommended, {
	// @ts-expect-error Don't worry about rules that eslint does not understand
	rules,
	plugins: {
		'@stylistic': stylistic,
	},
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
