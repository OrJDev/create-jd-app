import styles from "./index.module.css";
import { type VoidComponent, Suspense, Show } from "solid-js";
import { A } from "@solidjs/router";
import { createSession, signOut, signIn } from "@solid-mediakit/auth/client";
import { helloQuery } from "~/server/hello/hello.queries";

const Home: VoidComponent = () => {
  const hello = helloQuery(() => ({ hello: "from pRPC" }));
  return (
    <main>
      <div class={styles.container}>
        <h1 class={styles.title}>
          Create <span class={styles.greenSpan}>JD</span> App
        </h1>
        <div class={styles.cardRow}>
          <A
            class={styles.card}
            href="https://start.solidjs.com"
            target="_blank"
          >
            <h3 class={styles.cardTitle}>Solid Start →</h3>
            <div class={styles.cardText}>
              Learn more about Solid Start and the basics.
            </div>
          </A>
          <A
            class={styles.card}
            href="https://github.com/orjdev/create-jd-app"
            target="_blank"
          >
            <h3 class={styles.cardTitle}>JD End →</h3>
            <div class={styles.cardText}>
              Learn more about Create JD App, the libraries it uses, and how to
              deploy it
            </div>
          </A>
        </div>
        <div class={styles.showcaseContainer}>
          <p class={styles.showcaseText}>
            {hello.data ?? "Loading pRPC query"}
          </p>
          <Suspense>
            <AuthShowcase />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default Home;

const AuthShowcase: VoidComponent = () => {
  const session = createSession();
  return (
    <div class={styles.authContainer}>
      <Show
        when={session()}
        fallback={
          <button
            onClick={() => signIn("discord", { redirectTo: "/" })}
            class={styles.loginButton}
          >
            Sign in
          </button>
        }
      >
        <span class={styles.showcaseText}>Welcome {session()?.user?.name}</span>
        <button
          onClick={() => signOut({ redirectTo: "/" })}
          class={styles.loginButton}
        >
          Sign out
        </button>
      </Show>
    </div>
  );
};
