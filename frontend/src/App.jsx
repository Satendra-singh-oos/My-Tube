import React from "react";
import { Header } from "./components";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      {/* <Header /> */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;