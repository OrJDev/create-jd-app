/// <reference types="astro/client" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly GITHUB_TOKEN: string | undefined;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
