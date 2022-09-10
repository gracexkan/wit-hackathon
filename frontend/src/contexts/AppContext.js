import { createContext, useState, ReactNode } from "react";
import storage from "../storage";

export const AppContext = createContext({
  isDarkMode: false,
  setIsDarkMode: () => {},

  isSendNotification: false,
  setIsSendNotification: () => {},

  createdTasks: [],
  setCreatedTasks: () => {},
});

const AppContextProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(storage.get("isDarkMode"));
  const [isSendNotification, setIsSendNotification] = useState(
    storage.get("isSendNotification")
  );
  const [createdTasks, setCreatedTasks] = useState(storage.get("createdTasks"));

  const initialContext = {
    isDarkMode,
    setIsDarkMode,
    isSendNotification,
    setIsSendNotification,
    createdTasks,
    setCreatedTasks,
  };

  return (
    <AppContext.Provider value={initialContext}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
