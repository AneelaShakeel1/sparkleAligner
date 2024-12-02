import { createContext } from "react";

// Define the type for the context
interface ToggleContextType {
  isToggled: boolean;
  setToggled: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSideBar: () => void;
}

// Create context with a default value
const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

export { ToggleContext };
