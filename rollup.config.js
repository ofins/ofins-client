// rollup.config.js
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const sharedConfig = {
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    resolve({
      extensions: [".js", ".ts", ".tsx"],
    }),
    commonjs(),
    terser(),
  ],
  external: ["react", "react/jsx-runtime", "react-dom"],
};

export default [
  // Main entry point
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.js",
        format: "es",
        sourcemap: true,
      },
    ],
    ...sharedConfig,
  },
  // Core entry point
  {
    input: "src/core.ts",
    output: [
      {
        file: "dist/core.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/core.js",
        format: "es",
        sourcemap: true,
      },
    ],
    ...sharedConfig,
  },
  // React entry point
  {
    input: "src/react.ts",
    output: [
      {
        file: "dist/react.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/react.js",
        format: "es",
        sourcemap: true,
      },
    ],
    ...sharedConfig,
  },
];
