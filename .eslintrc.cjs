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
		'@typescript-eslint/ban-ts-comment': ['error', {
			'ts-expect-error': 'allow-with-description',
			'minimumDescriptionLength': 10,
		}],
		'no-underscore-dangle': [
			'warn',
			{
				allow: ['__unsafeInternalStore'],
			},
		],
	},
};
