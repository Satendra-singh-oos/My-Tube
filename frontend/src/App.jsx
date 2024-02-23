import React, { useEffect, useState } from "react";
import { Header } from "./components";
import { Outlet } from "react-router-dom";
import { getCurrentUser } from "./helper/authapicalls";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/Slice/authSlice";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispactch = useDispatch();
  useEffect(() => {
    const response = getCurrentUser()
      .then((response) => {
        if (response) {
          dispactch(login({ response }));
        } else {
          dispactch(logout());
        }
      })
      .catch((err) => console.log(err.message))
      .finally(() => setLoading(false));
  });
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
