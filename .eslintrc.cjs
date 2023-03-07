module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'@lachlanmcdonald/eslint-config-eslint',
	],
	plugins: [
		'@typescript-eslint',
	],
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
	},
};
