import { Component } from "solid-js";
import { Home } from "./pages";
import { Routes, Route, Router, Navigate } from "@solidjs/router";
import { Toaster } from "solid-toast";

interface IAppProps {}

const App: Component<IAppProps> = ({}) => {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" component={Home} />
        <Route path="*" component={() => <Navigate href="/" />} />
      </Routes>
      <div class="h-16 w-full" />
    </Router>
  );
};

export default App;
