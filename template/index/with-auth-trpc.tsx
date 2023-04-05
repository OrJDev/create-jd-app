import styles from "./index.module.css";
import { type VoidComponent } from "solid-js";
import { A } from "solid-start";
import { createSession, signOut, signIn } from "@solid-auth/base/client";
import { trpc } from "~/utils/trpc";

const Home: VoidComponent = () => {
  const hello = trpc.example.hello.useQuery(() => ({ name: "from tRPC" }));
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
            {hello.data ?? "Loading tRPC query"}
          </p>
          <AuthShowcase />
        </div>
      </div>
    </main>
  );
};

export default Home;

const AuthShowcase: VoidComponent = () => {
  const sessionData = createSession();
  return (
    <div class={styles.authContainer}>
      <p class={styles.showcaseText}>
        {sessionData().status === "authenticated" && (
          <span>
            Logged in as{" "}
            {sessionData().data?.user?.name ?? sessionData().data?.user?.email}
          </span>
        )}
      </p>
      <button
        class={styles.loginButton}
        onClick={() => {
          if (sessionData().status === "authenticated") {
            void signOut();
          } else {
            void signIn("github");
          }
        }}
      >
        {sessionData().status === "authenticated" ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
