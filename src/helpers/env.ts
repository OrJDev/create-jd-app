import path from "path";
import fs from "fs-extra";
import { IEnv } from "~types/Config";

export type IResolveEnvResp = {
  newSchema: string;
  newEnv: string;
};

export async function updateEnv(userDir: string, env: IResolveEnvResp) {
  let schema = path.join(userDir, "apps/server/src", "env", "schema.mjs");
  await fs.writeFile(
    schema,
    `// @ts-check
    import { z } from "zod";
    
    export default z.object({\n${env.newSchema}
    });
    `
  );
  await fs.appendFile(path.join(userDir, ".env"), env.newEnv);
}

export const resolveEnv = (env: IEnv[][]): Promise<IResolveEnvResp> => {
  return new Promise((resolve) => {
    let newEnv = "";
    let newSchema = "";

    for (const keys of env) {
      let tempNewEnv = "";
      for (const [idx, element] of keys.entries()) {
        let value = `${idx === 0 ? "" : "\n"}\t${element.key}: z.${
          element.type
        },`;
        newSchema += value;
        if (!element.ignore) {
          tempNewEnv += `${element.key}=${element.defaulValue ?? ""}\n`;
        }
      }
      newEnv += tempNewEnv;
    }
    return resolve({ newEnv, newSchema });
  });
};
