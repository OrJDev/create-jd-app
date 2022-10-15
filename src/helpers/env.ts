import path from "path";
import fs from "fs-extra";
import { IEnv } from "~types";

export type IResolveEnvResp = {
  newSchema: string;
  newEnv: string;
};

export async function updateEnv(userDir: string, _env: IEnv[]) {
  const env = await resolveEnv(_env);
  const ENV_DIR = path.join(userDir, "src", "env");
  let schema = path.join(ENV_DIR, "schema.ts");
  await fs.writeFile(
    schema,
    `import { z } from "zod";

export default z.object({\n${env.newSchema}
});
`
  );
  await fs.outputFile(path.join(userDir, ".env"), env.newEnv);
}

export const resolveEnv = (env: IEnv[]): Promise<IResolveEnvResp> => {
  return new Promise((resolve) => {
    let newEnv = "";
    let newSchema = "";

    for (const [idx, element] of env.entries()) {
      let value = `${idx === 0 ? "" : "\n"}  ${element.key}: z.${
        element.type
      },`;
      newSchema += value;
      if (!element.ignore) {
        newEnv += `${element.key}=${element.defaulValue ?? ""}\n`;
      }
    }
    return resolve({ newEnv, newSchema });
  });
};
