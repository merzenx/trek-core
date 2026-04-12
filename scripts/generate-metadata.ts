// generate template metadata for examples
import path from "node:path";
import fs from "node:fs";

const examplesDir = path.join(__dirname, "../examples");
const outputFile = path.join(__dirname, "../examples/metadata.json");

const examples = fs
  .readdirSync(examplesDir)
  .filter((dir) => fs.statSync(path.join(examplesDir, dir)).isDirectory())
  .map((dir) => {
    return {
      name: dir,
      path: "examples/" + dir,
    };
  });

const metadata = {
  examples,
};

fs.writeFileSync(outputFile, JSON.stringify(metadata, null, 2));
