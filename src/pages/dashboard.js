import React from "react";
import Header from "../components/Header";
import { SideBar } from "../components/SideBar";
import { Typography } from "antd";
const { Text, Paragraph } = Typography;

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
          <div className="lg:py-20 py-10 px-8 flex flex-col justify-center items-center">
            <Text className="text-[#2C2C2E] md:text-2xl text-xl font-normal mt-2 mb-2">
              Welcome to our E-book Store
            </Text>
            <Paragraph className="sm: items-center">
              Write your E-book & sale it & get profit.
            </Paragraph>
          </div>
        </section>
      </section>
    </div>
  );
}
