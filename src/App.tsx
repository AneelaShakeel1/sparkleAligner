import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Agents from "./pages/Agents/Agents";
import Doctors from "./pages/Doctors/Doctors";
import Clients from "./pages/Clients/Clients";
import AddUser from "./pages/AddUser/AddUser";
import Login from "./pages/Login/Login";
import EditAgent from "./components/EditAgent/EditAgent";
import EditClient from "./components/EditClient/EditClient";
import EditDoctor from "./components/EditDoctor/EditDoctor";
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
          <Route path="/agents" element={<Agents />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/agents/edit/:key" element={<EditAgent />} />
          <Route path="/clients/edit/:key" element={<EditClient />} />
          <Route path="/doctors/edit/:key" element={<EditDoctor />} />
        </Routes>
      </>
    </>
  );
};

export default App;
