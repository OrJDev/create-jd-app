import fs from "fs-extra";
import path from "path";

const basePath = path.join(__dirname, "../src", "installers");

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
    fs.copy(
      path.join(__dirname, "../README.MD"),
      path.join(__dirname, "../dist/README.MD")
    ),
  ]);
}

main();