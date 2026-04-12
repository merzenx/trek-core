#!/usr/bin/env node

import { program } from "commander";
import { input, select, Separator } from "@inquirer/prompts";

const PROJECT_GITHUB_URL = "https://github.com/merzenx/trek-ui";

const fetch_metadata = async () => {
  const response = await fetch(`${PROJECT_GITHUB_URL}/blob/main/examples/metadata.json`);
  const metadata = await response.json();
  return metadata;
};

program
  .command("init")
  .description("Initialize a new Trek project")
  .action(async () => {

    const examples_json = await fetch_metadata().catch(() => {});

    const project_name = await input({ message: 'Enter project name:',default: "ui" });

    const templates = await select({
      message: "Select a package manager",
      choices: [
        { name: "NPM", value: "npm", description: "The default Node.js manager" },
        { name: "Yarn", value: "yarn" },
        new Separator(),
        { name: "PNPM", value: "pnpm", disabled: "(Legacy support only)" },
      ],
    });
  });

program.parse(process.argv);
