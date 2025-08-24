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

export default {
  input: "lib/index.ts",
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
};
