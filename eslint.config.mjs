import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config({
	// Build output (`src/bld`) and emitted decls (`out`) are generated — never lint them
	ignores: ['src/bld/**', 'out/**'],
}, {
	plugins: {
		'@stylistic': stylistic
	},
	files: ['**/*.ts'],
	extends: [
		eslint.configs.recommended,
		tseslint.configs.recommended
	],
	rules: {
		"@stylistic/comma-dangle": ["error", "only-multiline"],
		"@stylistic/indent": ["error", "tab", { "SwitchCase": 1, "ImportDeclaration": 1 }],
		"@stylistic/no-tabs": ["error", { allowIndentationTabs: true }],
		"@stylistic/quotes": ["error", "single"],
		"@stylistic/semi": ["error", "never"],
		"no-lone-blocks": 0,
		// Allow intentionally-unused identifiers when prefixed with `_` (e.g. reserved/documented params)
		"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
	},
});

/*
export  defineConfig([
	{
		files: ["src/*.ts"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: ['./tsconfig.json'],  // enables “typed” rules
			},
		},
		...tseslint.configs.recommendedTypeChecked[0],  // base + type‑aware rules
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
			"@typescript-eslint/indent": ["error", "tab"],
			"@typescript-eslint/prefer-nullish-coalescing": 0, // "warn", too many items!
			"@typescript-eslint/restrict-plus-operands": "warn", // TODO: "error"
			"@typescript-eslint/restrict-template-expressions": "warn", // TODO: "error"
			"@typescript-eslint/strict-boolean-expressions": "off",
			"comma-dangle": ["error", "only-multiline"],
			"no-lone-blocks": 0,
			"no-tabs": ["error", { allowIndentationTabs: true }],
			indent: ["error", "tab", { "SwitchCase": 1, "ImportDeclaration": 1 }],
			quotes: ["error", "single"],
			semi: ["error", "never"],
		},
	},
]);
*/

/*
module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"plugin:react/recommended",
		"standard-with-typescript",
		"plugin:@typescript-eslint/recommended",
	],
	overrides: [],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json"],
	},
	plugins: ["react", "@typescript-eslint"],
	ignorePatterns: [".eslintrc.js", "*.mjs", "index.d.ts", "gulpfile.js"],
	rules: {
		"@typescript-eslint/indent": ["error", "tab"],
		"@typescript-eslint/prefer-nullish-coalescing": 0, // "warn", too many items!
		"@typescript-eslint/restrict-plus-operands": "warn", // TODO: "error"
		"@typescript-eslint/restrict-template-expressions": "warn", // TODO: "error"
		"@typescript-eslint/strict-boolean-expressions": 0,
		"comma-dangle": ["error", "only-multiline"],
		"no-lone-blocks": 0,
		"no-tabs": ["error", { allowIndentationTabs: true }],
		indent: ["error", "tab", { "SwitchCase": 1, "ImportDeclaration": 1 }],
		quotes: ["error", "single"],
		semi: ["error", "never"],
	},
};
*/
