import { Component } from "solid-js";
import { Bash, Info, Social } from "~/components";

interface IHomeProps {}

const Home: Component<IHomeProps> = ({}) => {
  return (
    <div class="flex flex-col gap-3 sm:gap-24 pt-28 items-center justify-center sm:flex-row animate-fade-in">
      <div class="flex flex-col items-center gap-3 ">
        <h1 class="font-bold text-3xl xs:text-5xl text-gray-400 text-center">
          Create{" "}
          <span class="text-blue-500 hover:text-blue-300 cursor-default">
            JD
          </span>{" "}
          App
        </h1>
        <Bash />
        <Info />
        <Social />
      </div>
      <img
        class="transition-transform hover:scale-105 cursor-pointer px-5"
        src="https://user-images.githubusercontent.com/91349014/190457447-3fa7dc08-cb5e-4e03-81d3-955133cae0ad.png"
      />
    </div>
  );
};

export default Home;
