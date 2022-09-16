import { ToastOptions } from "solid-toast";

export const toastConfig: ToastOptions = {
  position: "top-center",
  duration: 3000,
  style: {
    color: "#fff",
    "font-weight": "bold",
    "background-color": "#262626",
  },
  iconTheme: {
    primary: "#3b82f6",
  },
};

export const CREATE_JD_APP_CMD = "npm create jd-app@latest";
