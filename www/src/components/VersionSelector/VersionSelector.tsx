import { Accessor, Component, createMemo, For, Setter } from "solid-js";

interface IVersionselectorProps {
  setSelectedVersion: Setter<string>;
  selectedVersion: Accessor<string>;
  versions: Accessor<string[] | null>;
  latestVersion: Accessor<string | null>;
}

const Versionselector: Component<IVersionselectorProps> = ({
  setSelectedVersion,
  selectedVersion,
  latestVersion,
  versions,
}) => {
  const newVersions = createMemo(() => [
    "latest",
    ...(versions() ?? []).filter((v) => v !== latestVersion()),
  ]);
  return (
    <>
      <h3 class="font-semibold text-lg text-gray-300">Select a version</h3>
      <select
        value={selectedVersion()}
        onChange={(e) => setSelectedVersion(e.currentTarget.value)}
        class="bg-zinc-800 focus:outline-none text-gray-400 text-sm rounded-lg xs:w-72 p-3 sm:p-2.5 w-3/5"
      >
        <For each={newVersions()}>
          {(curr) => (
            <option value={curr}>
              {curr.charAt(0).toUpperCase() + curr.slice(1)}
            </option>
          )}
        </For>
      </select>
    </>
  );
};

export default Versionselector;
