import path from "path";
import fs from "fs-extra";
import { IEnv } from "~types";

export type IResolveEnvResp = {
  newServerScheme: string;
  newClientScheme: string;
  newEnv: string;
};

export async function updateEnv(userDir: string, _env: IEnv[]) {
  const env = await resolveEnv(_env);
  const ENV_DIR = path.join(userDir, "src", "env");
  let schema = path.join(ENV_DIR, "schema.ts");
  await fs.writeFile(
    schema,
    `import { z } from "zod";

export const serverScheme = z.object({\n${env.newServerScheme}
});

export const clientScheme = z.object({\n${env.newClientScheme}
});
`
  );
  if (env.newEnv.trim().length) {
    await fs.outputFile(path.join(userDir, ".env"), env.newEnv);
  }
}

export const resolveEnv = (env: IEnv[]): Promise<IResolveEnvResp> => {
  return new Promise((resolve) => {
    let newEnv = "";
    let newClientScheme = "";
    let newServerScheme = "";

    let serverWasIn = false;
    let clientWasIn = false;
    for (const element of env) {
      const shouldAddNewLine =
        element.kind === "server" ? serverWasIn : clientWasIn;
      let value = `${shouldAddNewLine ? "\n" : ""}  ${element.key}: z.${
        element.type
      },`;
      if (element.kind === "server") {
        serverWasIn = true;
        newServerScheme += value;
      } else {
        clientWasIn = true;
        newClientScheme += value;
      }
      if (!element.ignore) {
        newEnv += `${element.key}=${element.defaulValue ?? ""}\n`;
      }
    }
    return resolve({ newEnv, newClientScheme, newServerScheme });
  });
};
