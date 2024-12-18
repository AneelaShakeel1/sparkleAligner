import React, { useState } from "react";
import { ToggleContext } from ".";

const ToggleProvider = ({ children }) => {
  const [isToggled, setToggled] = useState(false);
  const toggleSideBar = () => setToggled(!isToggled);

  return (
    <ToggleContext.Provider
      value={{
        isToggled,
        setToggled,
        toggleSideBar,
      }}
    >
      {children}
    </ToggleContext.Provider>
  );
};

export { ToggleProvider };
