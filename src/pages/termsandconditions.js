import React from "react";
import { SideBar } from "../components/SideBar";

export default function TermsAndConditions() {
  return (
    <div className="h-full min-h-screen grid grid-columns">
      <SideBar />
      <div className="relative flex flex-col">
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="p-6 rounded-xl w-96 h-auto"
            style={{
              boxShadow: "4px 4px 10px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p>
              <strong className="text-[#0b3c95]">
                Data Monitoring Disclaimer:
              </strong>
              <br />
              <span className="text-sm">
                Please note that Sparkle Aligner Application does not monitor your data.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
