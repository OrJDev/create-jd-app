import type { DefaultSession } from "@auth/core/types";

declare module "@auth/core/types" {
  export interface Session {
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
}
