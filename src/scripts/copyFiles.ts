import fs from "fs-extra";
import path from "path";
import { formatError } from "~utils/helpers";

const basePath = path.join(__dirname, "../installers");
const baseHelpersPath = path.join(__dirname, "../helpers");

async function main() {
  await Promise.all([
    fs.copy(
      path.join(__dirname, "../../", "README.md"),
      path.join(__dirname, "../../", "dist", "README.md")
    ),
    ...(
      await fs.readdir(basePath)
    ).map(async (type) => {
      const newBasePath = path.join(basePath, type);
      const resp = await fs.readdir(newBasePath);
      await Promise.all(
        resp.map(async (installer) => {
          const oldPath = path.join(newBasePath, installer, "files");
          const newPath = oldPath.replace("src", "dist");
          if (await fs.pathExists(oldPath)) {
            await fs.copy(oldPath, newPath);
          } else {
            console.log({ type, oldPath });
          }
        })
      );
    }),
    ...(
      await fs.readdir(baseHelpersPath)
    ).map(async (helper) => {
      if ((await fs.stat(path.join(baseHelpersPath, helper))).isDirectory()) {
        const oldPath = path.join(baseHelpersPath, helper, "files");
        const newPath = oldPath.replace("src", "dist");
        await fs.copy(oldPath, newPath);
      }
    }),
  ]);
}

main().catch((e) => {
  console.log(formatError(e));
  process.exit(1);
});
