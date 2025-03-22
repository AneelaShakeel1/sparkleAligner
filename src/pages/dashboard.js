import React from "react";
import Header from "../components/Header";
import { SideBar } from "../components/SideBar";
import HRDashboard from "./newAnalytics";

export default function Home() {
  return (
    <div className="h-full min-h-screen grid grid-columns">
      <SideBar />
      <section>
        <Header />
        <section className="px-4 pt-32">
          <h2 className="text-primary md:text-[32px] text-xl font-medium ">
            Dashboard
          </h2>
          <HRDashboard />
        </section>
      </section>
    </div>
  );
}
