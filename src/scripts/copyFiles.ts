import fs from "fs-extra";
import path from "path";
import { formatError } from "~utils/helpers";

const basePath = path.join(__dirname, "../installers");

async function main() {
  await fs.copy(
    path.join(__dirname, "../../", "README.md"),
    path.join(__dirname, "../../", "dist", "README.md")
  );
  const types = await fs.readdir(basePath);
  for (const type of types) {
    const newBasePath = path.join(basePath, type);
    const resp = await fs.readdir(newBasePath);
    await Promise.all(
      resp.map(async (installer) => {
        const oldPath = path.join(newBasePath, installer, "files");
        const newPath = oldPath.replace("src", "dist");
        if (await fs.pathExists(oldPath)) {
          await fs.copy(oldPath, newPath);
        }
      })
    );
  }
}

main().catch((e) => {
  console.log(formatError(e));
  process.exit(1);
});
