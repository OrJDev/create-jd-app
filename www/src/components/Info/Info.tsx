import { Component, For, ParentComponent, Show } from "solid-js";
import features from "./features";

interface IInfoProps {}

const Info: Component<IInfoProps> = ({}) => {
  return (
    <>
      <h1 class="font-bold text-2xl xs:text-4xl text-gray-300 cursor-default">
        What Is <ColoredText>JD</ColoredText>
      </h1>
      <p class="font-semibold text-gray-300 xs:max-w-[29rem] text-center mx-4">
        This is a <ColoredText>CLI</ColoredText> tool that helps you create a
        new <ColoredText>SolidJS</ColoredText> {"& "}
        <ColoredText>tRPC</ColoredText> full-stack{" "}
        <ColoredText>TypeScript</ColoredText> application with a single command,
        within seconds.
      </p>
      <div class="flex space-x-2 flex-wrap max-w-[30rem]">
        <For each={features}>
          {(curr, idx) => (
            <span class="text-xl font-bold flex flex-row space-x-2 justify-center items-center">
              {curr}
              <Show when={idx() !== features.length - 1}>
                <span class="text-blue-600 hover:text-gray-300">|</span>
              </Show>
            </span>
          )}
        </For>
      </div>
    </>
  );
};

const ColoredText: ParentComponent = ({ children }) => (
  <strong class="text-blue-500 hover:text-blue-300 cursor-default">
    {children}
  </strong>
);

export default Info;
