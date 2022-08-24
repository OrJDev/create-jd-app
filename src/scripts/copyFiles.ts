import fs from "fs-extra";
import path from "path";
import { formatError } from "~utils/helpers";

const basePath = path.join(__dirname, "../installers");

async function main() {
  await fs.copy(
    path.join(__dirname, "../../", "README.md"),
    path.join(__dirname, "../../", "dist", "README.md")
  );
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
      path.join(__dirname, "../../", "README.md"),
      path.join(__dirname, "../../", "dist", "README.md")
    ),
  ]);
}

main().catch((e) => {
  console.log(formatError(e));
  process.exit(1);
});
