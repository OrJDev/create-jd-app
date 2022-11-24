import { type ParentComponent, Switch, Match } from "solid-js";
import { Title, useRouteData } from "solid-start";
import { trpc } from "~/utils/trpc";
import { createServerData$ } from "solid-start/server";
import { authenticator } from "~/server/auth";
import { authClient } from "~/utils/auth";

export const routeData = () => {
  return createServerData$(async (_, { request }) => {
    const user = await authenticator.isAuthenticated(request);
    return user;
  });
};

const Home: ParentComponent = () => {
  const user = useRouteData<typeof routeData>();
  const res = trpc.secret.useQuery(undefined, {
    get enabled() {
      return !!user();
    },
  });

  return (
    <>
      <Title>Home</Title>
      <div>
        <Switch 
          fallback={
            <pre class="font-bold text-2xl text-gray-500">
              {JSON.stringify(res.data, null, 2)}
            </pre>
          }
        >
          <Match when={res.isLoading}>
            <div class="font-bold text-2xl text-gray-500">
              {res.isFetching ? "Loading" : "Not Logged In"}
            </div>
          </Match>
        </Switch>
        <Switch
          fallback={
            <button
              onClick={() =>
                authClient.login("discord", {
                  successRedirect: "/",
                  failureRedirect: "/",
                })
              }
              class="bg-purple-700 mx-3 my-3 rounded-lg w-56 p-2.5 text-white font-bold flex items-center justify-center"
            >
              Login with discord
            </button>
          }
        >
          <Match when={user.loading}>
            <h1>Loading user</h1>
          </Match>
          <Match when={user()}>
            <button
              onClick={() =>
                authClient.logout({
                  redirectTo: "/",
                })
              }
              class="bg-purple-700 mx-3 my-3 rounded-lg w-56 p-2.5 text-white font-bold flex items-center justify-center"
            >
              Logout
            </button>
          </Match>
        </Switch>
      </div>
    </>
  );
};

export default Home;
