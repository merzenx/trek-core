import { defineConfig } from "tsdown";

const uiConfig = defineConfig({
  entry: ["./src/index.ts"],
  outDir: "dist",
  format: ["module"],
  dts: true,
  treeshake: true,
  clean: true,
});

const cliConfig = defineConfig({
  entry: ["./src/cli.ts"],
  outDir: "dist/cli",
  format: ["cjs"],
  dts: false,
  treeshake: true,
  clean: true,
  copy: [
    {
      from: "./src/styles/trek.css",
      to: "./dist",
    },
  ],
});

export default [uiConfig, cliConfig];
