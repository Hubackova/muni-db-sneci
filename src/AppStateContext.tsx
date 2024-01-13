import React, { createContext, useContext, useState } from "react";

export type AppStateType = {
  currentLocality: string;
  setCurrentLocality: (c: string) => void;
  setLocalityData: (data: any) => void;
  localityData: any;
};

export const initialAppState: AppStateType = {
  currentLocality: "",
  setCurrentLocality: () => {},
  setLocalityData: () => {},
  localityData: null,
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
  const setLocalityData = (data: any) => {
    setState((prevState) => ({
      ...prevState,
      localityData: data,
    }));
  };

  return (
    <AppStateContext.Provider
      value={{ ...state, setCurrentLocality, setLocalityData }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

AppStateContext.displayName = "AppStateContext";
const useAppStateContext = () => useContext(AppStateContext);

export { AppStateProvider, useAppStateContext };
