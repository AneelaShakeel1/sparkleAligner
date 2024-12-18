import React from "react";
import { Svgs } from "../Svgs/svg-icons";

function Logo() {
  return (
    <div className="flex justify-center items-center border-[#CED3DA] border-opacity-[0.2] w-full border-b-2 pb-5">
      {Svgs.logo}
    </div>
  );
}

export default Logo;
