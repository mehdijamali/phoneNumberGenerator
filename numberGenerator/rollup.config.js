// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json"; // Import the JSON plugin

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/bundle.js",
      format: "es", // or 'cjs' depending on your target environment
      sourcemap: true,
    },
    plugins: [
      json(), // Add the JSON plugin to the plugins array
      resolve({
        extensions: [".js", ".ts"],
        preferBuiltins: true,
      }),
      commonjs({
        include: /node_modules/, // Ensure it includes node_modules,
        strictRequires: true,
      }),
      typescript({ tsconfig: "./tsconfig.build.json" }),
    ],
  },
];
