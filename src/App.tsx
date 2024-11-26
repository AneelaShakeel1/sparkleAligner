import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./pages/Home/Home";
import Settings from "./pages/Settings/Settings";
import Login from "./pages/Login/Login";
import FAQ from "./pages/FAQ/FAQ";
import "./App.css";

const App: React.FC = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === "/" ? true : false;

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </>
    </>
  );
};

export default App;
