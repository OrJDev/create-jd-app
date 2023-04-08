import styles from "./index.module.css";
import { type VoidComponent, Show } from "solid-js";
import { A } from "solid-start";
import { helloQuery, meQuery } from "rpc/queries";
import { signOut, signIn } from "@solid-auth/base/client";

const Home: VoidComponent = () => {
  const hello = helloQuery(() => ({
    name: "from pRPC",
  }));
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
          <AuthShowcase />
        </div>
      </div>
    </main>
  );
};

export default Home;

const AuthShowcase: VoidComponent = () => {
  const session = meQuery();
  return (
    <Show when={session.data}>
      <div class={styles.authContainer}>
        <p class={styles.showcaseText}>
          {session.data?.info && (
            <span>Logged in as {session.data.info?.user?.name}</span>
          )}
        </p>
        <button
          class={styles.loginButton}
          onClick={() => {
            if (session.data?.info) {
              void signOut().then(() => session.refetch());
            } else {
              void signIn("github");
            }
          }}
        >
          {session.data?.info ? "Sign out" : "Sign in"}
        </button>
      </div>
    </Show>
  );
};
