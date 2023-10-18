import React, { createContext, useContext, useState } from "react";

export type AppStateType = {
  currentLocality: string;
  setCurrentLocality: (c: string) => void;
};

export const initialAppState: AppStateType = {
  currentLocality: "",
  setCurrentLocality: () => {},
};

const AppStateContext = createContext<AppStateType>(initialAppState);

const AppStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState(initialAppState);

  const setCurrentLocality = (locality: string) => {
    setState((prevState) => ({
      ...prevState,
      currentLocality: locality,
    }));
  };

  return (
    <AppStateContext.Provider value={{ ...state, setCurrentLocality }}>
      {children}
    </AppStateContext.Provider>
  );
};

AppStateContext.displayName = "AppStateContext";
const useAppStateContext = () => useContext(AppStateContext);

export { AppStateProvider, useAppStateContext };
