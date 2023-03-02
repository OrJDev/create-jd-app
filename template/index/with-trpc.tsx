import styles from "./index.module.css";
import { type VoidComponent } from "solid-js";
import { A } from "solid-start";
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
        <p>{hello.data ?? "Loading tRPC query"}</p>
      </div>
    </main>
  );
};

export default Home;
