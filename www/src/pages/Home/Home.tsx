import { Component, createSignal, onMount } from "solid-js";
import toast from "solid-toast";
import { Bash, Info, Social, VersionSelector } from "~/components";
import { toastConfig } from "~/constants";

interface IHomeProps {}

const Home: Component<IHomeProps> = ({}) => {
  const [selectedVersion, setSelectedVersion] = createSignal("latest");
  const [versions, setVersions] = createSignal<string[] | null>(null);
  const [latestVersion, setLatestVersion] = createSignal<string | null>(null);

  onMount(async () => {
    try {
      const resp = await (
        await fetch("https://registry.npmjs.org/create-jd-app")
      ).json();
      setLatestVersion(resp["dist-tags"].latest);
      setVersions(Object.keys(resp["versions"]));
    } catch {
      toast.error("Something went wrong...", toastConfig);
    }
  });

  return (
    <div class="flex flex-col items-center gap-3 animate-fade-in pt-16">
      <VersionSelector
        selectedVersion={selectedVersion}
        versions={versions}
        setSelectedVersion={setSelectedVersion}
        latestVersion={latestVersion}
      />
      <Bash selectedVersion={selectedVersion} />
      <Info />
      <Social />
    </div>
  );
};

export default Home;
