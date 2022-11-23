import { withProtected } from "../layouts/Protected";

export const { routeData, Page } = withProtected((user) => {
  return <h1>Hey {user.displayName}</h1>;
});

export default Page;
