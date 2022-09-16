import { Component } from "solid-js";
import toast from "solid-toast";
import { CREATE_JD_APP_CMD, toastConfig } from "~/constants";

interface IBashProps {}

const Bash: Component<IBashProps> = ({}) => {
  return (
    <code
      onClick={() =>
        navigator.clipboard
          .writeText(CREATE_JD_APP_CMD)
          .then(() => toast.success("Copied to clipboard!", toastConfig))
          .catch(() => toast.error("Something went wrong...", toastConfig))
      }
      class="px-3 mb-3 my-2 py-1.5 text-base text-blue-300 rounded-md cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition-all duration-300 anim-2"
    >
      {CREATE_JD_APP_CMD}
    </code>
  );
};

export default Bash;
