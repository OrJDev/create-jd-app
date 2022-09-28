import fs from "fs-extra";
import path from "path";
import { formatError } from "~utils/helpers";

const basePath = path.join(__dirname, "../installers");
const baseHelpersPath = path.join(__dirname, "../helpers", "files");

async function main() {
  await Promise.all([
    ...(
      await fs.readdir(basePath)
    ).map(async (installer) => {
      const oldPath = path.join(basePath, installer, "files");
      const newPath = oldPath.replace("src", "dist");
      if (await fs.pathExists(oldPath)) {
        await fs.copy(oldPath, newPath);
      }
    }),
    fs.copy(baseHelpersPath, baseHelpersPath.replace("src", "dist")),
    fs.copy(
      path.join(__dirname, "../../README.MD"),
      path.join(__dirname, "../../dist/README.MD")
    ),
  ]);
}

main().catch((e) => {
  console.log(formatError(e));
  process.exit(1);
});
