import { ParentComponent } from "solid-js";
import { Title } from "solid-start";

interface IHomeProps {}

const Home: ParentComponent<IHomeProps> = ({}) => {
  return (
    <>
      <Title>Home</Title>
      <div>
        <h1>Hey There Pal</h1>
      </div>
    </>
  );
};

export default Home;
