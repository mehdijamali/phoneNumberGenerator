import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/bundle.js",
      format: "es",
      sourcemap: true,
    },
    plugins: [
      json(),
      resolve({
        extensions: [".js", ".ts"],
        preferBuiltins: true,
      }),
      commonjs({
        include: /node_modules/,
        strictRequires: true,
      }),
      typescript({ tsconfig: "./tsconfig.build.json" }),
    ],
  },
];
