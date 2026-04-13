import { defineConfig } from "tsdown";

const mainConfig = defineConfig({
  entry: ["./src/index.ts"],
  outDir: "dist",
  format: ["module"],
  dts: true,
  treeshake: true,
  clean: true,
});

const uiConfig = defineConfig({
  entry: ["./src/components/index.ts"],
  outDir: "dist/ui",
  format: ["module"],
  dts: true,
  treeshake: true,
  clean: true,
  copy: [
    {
      from: "./src/styles/trek.css",
      to: "./dist/ui",
    },
  ],
  external: ["react", "react-dom"],
});

const cliConfig = defineConfig({
  entry: ["./src/cli.ts"],
  outDir: "dist/cli",
  format: ["cjs"],
  dts: false,
  treeshake: true,
  clean: true,
});

const apiConfig = defineConfig({
  entry: ["./src/api/index.ts"],
  outDir: "dist/api",
  format: ["module"],
  dts: true,
  treeshake: true,
  clean: true,
});

export default [mainConfig, uiConfig, cliConfig, apiConfig];
