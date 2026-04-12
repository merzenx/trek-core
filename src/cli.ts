#!/usr/bin/env node

import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { program } from "commander";
import { input, select } from "@inquirer/prompts";

const REPO = "merzenx/trek-core";
const PROJECT_GITHUB_URL = `https://github.com/${REPO}`;

type ExampleMeta = { name: string; path: string };

const fetch_metadata = async (): Promise<ExampleMeta[]> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/${REPO}/refs/heads/main/examples/metadata.json`,
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch examples list (${response.status}): ${response.statusText}`);
  }
  const metadata = (await response.json()) as { examples: ExampleMeta[] };
  return metadata.examples;
};

function assertValidProjectName(name: string): void {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Project name cannot be empty.");
  }
  if (trimmed === "." || trimmed === "..") {
    throw new Error("Invalid project name.");
  }
  if (/[/\\]/.test(trimmed)) {
    throw new Error("Project name cannot contain path separators.");
  }
}

function npmPackageNameFromDirName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
  return slug || "my-app";
}

function trekUiDependencyRange(): string {
  try {
    const pkgPath = join(__dirname, "..", "..", "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version?: string };
    if (pkg.version && /^\d+\.\d+\.\d+/.test(pkg.version)) {
      return `^${pkg.version}`;
    }
  } catch {
    /* published layout may differ */
  }
  return "^1.0.0";
}

function replacePlaceholderInTree(root: string, placeholder: string, value: string): void {
  const walk = (dir: string): void => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === "node_modules" || ent.name === ".git") continue;
        walk(full);
        continue;
      }
      if (!ent.isFile()) continue;
      const textish =
        /\.(html?|json|md|txt|tsx?|jsx?|css|mjs|cjs|vue|svelte)$/i.test(ent.name) ||
        ent.name === ".gitignore";
      if (!textish) continue;
      let content = readFileSync(full, "utf8");
      if (!content.includes(placeholder)) continue;
      content = content.split(placeholder).join(value);
      writeFileSync(full, content, "utf8");
    }
  };
  walk(root);
}

function patchPackageJsonForStandalone(projectRoot: string, displayName: string): void {
  const pkgPath = join(projectRoot, "package.json");
  if (!existsSync(pkgPath)) return;
  const raw = readFileSync(pkgPath, "utf8");
  const pkg = JSON.parse(raw) as {
    name?: string;
    dependencies?: Record<string, string>;
  };
  pkg.name = npmPackageNameFromDirName(displayName);
  if (pkg.dependencies?.["trek-core"] === "workspace:*") {
    pkg.dependencies["trek-core"] = trekUiDependencyRange();
  }
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
}

program
  .command("init")
  .description("Initialize a new Trek project")
  .action(async () => {
    const examples = await fetch_metadata();
    if (examples.length === 0) {
      throw new Error("No templates are available.");
    }

    const project_name = await input({
      message: "Enter project name:",
      default: "my-app",
    });
    assertValidProjectName(project_name);

    const templatePath = await select({
      message: "Select a template",
      choices: examples.map((e) => ({
        name: e.name,
        value: e.path,
      })),
    });

    const targetDir = resolve(process.cwd(), project_name.trim());
    if (existsSync(targetDir)) {
      throw new Error(`Directory already exists: ${targetDir}`);
    }

    const tmpRoot = mkdtempSync(join(tmpdir(), "trek-init-"));
    const cloneDir = join(tmpRoot, "repo");

    try {
      execSync(`git clone --depth 1 "${PROJECT_GITHUB_URL}.git" "${cloneDir}"`, {
        stdio: "inherit",
      });
      const sourcePath = join(cloneDir, ...templatePath.split("/"));
      if (!existsSync(sourcePath) || !statSync(sourcePath).isDirectory()) {
        throw new Error(`Template not found in repository: ${templatePath}`);
      }
      cpSync(sourcePath, targetDir, { recursive: true });
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true });
    }

    replacePlaceholderInTree(targetDir, "{{name}}", project_name.trim());
    patchPackageJsonForStandalone(targetDir, project_name.trim());

    console.log(`\nCreated ${targetDir}`);
    console.log(`  cd ${project_name.trim()}`);
    console.log("  pnpm install");
    console.log("  pnpm dev\n");
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
