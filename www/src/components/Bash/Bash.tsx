import { Accessor, Component, createMemo } from "solid-js";
import toast from "solid-toast";
import { CREATE_JD_APP_CMD, toastConfig } from "~/constants";

interface IBashProps {
  selectedVersion: Accessor<string>;
}

const Bash: Component<IBashProps> = ({ selectedVersion }) => {
  const newCMD = createMemo(() => `${CREATE_JD_APP_CMD}@${selectedVersion()}`);
  return (
    <code
      onClick={() =>
        navigator.clipboard
          .writeText(newCMD())
          .then(() => toast.success("Copied to clipboard!", toastConfig))
          .catch(() => toast.error("Something went wrong...", toastConfig))
      }
      class="px-3 mb-3 mt-1 py-1.5 text-base text-blue-300 rounded-md cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition-all duration-300"
    >
      {newCMD()}
    </code>
  );
};

export default Bash;
