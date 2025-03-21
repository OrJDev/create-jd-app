import styles from "./index.module.css";
import { A } from "@solidjs/router";
import { useAuth } from "@solid-mediakit/auth/client";
import { type VoidComponent, Match, Switch } from "solid-js";
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
          <p class={styles.showcaseText}>{hello.data}</p>
          <AuthShowcase />
        </div>
      </div>
    </main>
  );
};

export default Home;

const AuthShowcase: VoidComponent = () => {
  const auth = useAuth();
  return (
    <div class={styles.authContainer}>
      <Switch fallback={<div>Loading...</div>}>
        <Match when={auth.status() === "authenticated"}>
          <span class={styles.showcaseText}>
            Welcome {auth.session()?.user?.name}
          </span>
          <button
            onClick={() => auth.signOut({ redirectTo: "/" })}
            class={styles.loginButton}
          >
            Sign out
          </button>
        </Match>
        <Match when={auth.status() === "unauthenticated"}>
          <button
            onClick={() => auth.signIn("discord", { redirectTo: "/" })}
            class={styles.loginButton}
          >
            Sign in
          </button>
        </Match>
      </Switch>
    </div>
  );
};
