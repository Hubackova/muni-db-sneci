import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import TopBar from "./components/TopBar";
import routes from "./routes";
import Error404 from "./routes/Error404";
import HomePage from "./routes/HomePage";
import Localities from "./routes/Localities";
import LocalitiesAndSpecies from "./routes/LocalitiesAndSpecies";
import Species from "./routes/Species";
import SpeciesNames from "./routes/SpeciesNames";

const App: React.FC = () => {
  return (
    <div>
      <TopBar />
      <ToastContainer />
      <div className="app-container">
        <Routes>
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.localities} element={<Localities />} />
          <Route path={routes.species} element={<Species />} />
          <Route
            path={routes.localitiesAndSpecies}
            element={<LocalitiesAndSpecies />}
          />
          <Route path={routes.speciesNames} element={<SpeciesNames />} />
          <Route element={<Error404 returnUrl={routes.home} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
