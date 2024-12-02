import React, { useState, ReactNode } from "react";
import { ToggleContext } from ".";

// Define types for the context value
interface ToggleContextType {
  isToggled: boolean;
  setToggled: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSideBar: () => void;
}

// Define types for the component props
interface ToggleProviderProps {
  children: ReactNode;
}

const ToggleProvider: React.FC<ToggleProviderProps> = ({ children }) => {
  const [isToggled, setToggled] = useState<boolean>(false);
  const toggleSideBar = () => setToggled((prev) => !prev);

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
