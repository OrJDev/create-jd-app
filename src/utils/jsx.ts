import { ISyntax } from "~types";

const SPACES_PER_LINE = 5;
const ADD_SPACES_PER_LINE = 2;

export function resolveProviders(
  providers: string[],
  children: string[],
  spaces = SPACES_PER_LINE
): string {
  const SPACES = " ".repeat(spaces - 1);
  if (!providers.length)
    return children.map((child) => `${SPACES}${child}`).join("\n");
  const el = <string>providers.shift();
  const elWithoutProps = <string>el.split(" ").shift();
  return `${SPACES}<${el}>\n${resolveProviders(
    providers,
    children,
    spaces + ADD_SPACES_PER_LINE
  )}\n${SPACES}</${elWithoutProps}>`;
}

export const getStyle = (useTW: boolean, style: string) =>
  useTW ? ` class="${style}"` : "";

export const actionToSyntax = (
  syntax: ISyntax,
  path: string,
  action: "Mutation" | "Query",
  route?: string,
  ...args: any[]
) => {
  if (syntax === "v9") {
    return `trpc.create${action}(() => "${route ? `${route}.` : ""}${path}"${
      args.length ? `, ${args.join(", ")}` : ""
    });`;
  }
  return `trpc.${path}.use${action}(${args.join(", ")});`;
};
