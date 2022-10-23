import { IUtil } from "~types";

const getRootPage: IUtil = (ctx) => {
  const useTRPC = ctx.installers.includes("tRPC");
  const useStyled = ctx.installers.includes("Solid-Styled");
  return `// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";${
    useTRPC
      ? '\nimport { TRPCProvider } from "solid-trpc";\nimport { client, queryClient } from "./utils/trpc";'
      : ""
  }${!useStyled ? '\nimport "./root.css";' : ""}

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Create JD App</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
${getChildren(useTRPC)}
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}`;
};

const getChildren = (useTRPC: boolean) => {
  return useTRPC
    ? `            <TRPCProvider client={client} queryClient={queryClient}>
              <Routes>
                <FileRoutes />
              </Routes>
            </TRPCProvider>`
    : `            <Routes>
              <FileRoutes />
            </Routes>`;
};

export default getRootPage;
