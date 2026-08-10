import pkg from "./package.json" with { type: "json" };
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

const nodeBuiltinsRE = /^node:.*/; /* Regex that matches all Node built-in specifiers */

const external = [
	nodeBuiltinsRE,
	...Object.keys(pkg.dependencies || {}),
	...Object.keys(pkg.peerDependencies || {}),
];

export default [
	{
		input: "src/pptxgen.ts",
		output: [
			{
				file: "./src/bld/pptxgen.js",
				format: "iife",
				name: "PptxGenJS",
				globals: { "@node-projects/jszip": "JSZip" },
			},
			{ file: "./src/bld/pptxgen.cjs.js", format: "cjs", exports: "default" },
			{ file: "./src/bld/pptxgen.es.js", format: "es" },
		],
		external,
		plugins: [
			resolve({ preferBuiltins: true }),
			commonjs(),
			typescript({ typescript: require("typescript") }),
		]
	},
	// Auto-generated type bundle: tsc emits per-module declarations to out/defs
	// (tsconfig `declaration`+`declarationDir`), rollup-plugin-dts flattens them
	// into the single public types/index.d.ts that ships with the package.
	{
		input: "out/defs/pptxgen.d.ts",
		output: [{ file: "types/index.d.ts", format: "es" }],
		external,
		// `--bundleConfigAsCjs` transpiles this file to CJS, where the plugin's
		// ESM default-export interop collapses differently — use the named `dts`.
		plugins: [(dts.default ?? dts)()],
	},
];
