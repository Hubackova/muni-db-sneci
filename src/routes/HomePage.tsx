// @ts-nocheck
import React from "react";
import NewLocalityForm from "../components/forms/NewLocalityForm";
import NewSpeciesForm from "../components/forms/NewSpeciesForm";
import SpeciesAtLocalityForm from "../components/forms/SpeciesAtLocalityForm";

import "./HomePage.scss";
import "./Table.scss";

const HomePage: React.FC = () => {
  return (
    <div className="main-wrapper">
      <div className="form-wrapper">
        <NewLocalityForm />
      </div>
      <div className="right-side">
        <SpeciesAtLocalityForm />
        <div className="form-wrapper">
          <NewSpeciesForm />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
