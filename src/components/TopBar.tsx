// @ts-nocheck

import { getDatabase, onValue, ref } from "firebase/database";
import React from "react";
import { NavLink } from "react-router-dom";
import routes from "../routes";
import "./TopBar.scss";
import { useAppStateContext } from "../AppStateContext";

const TopBar: React.FC = () => {
  const db = getDatabase();
  const { currentLocality, setCurrentLocality, setLocalityData } =
    useAppStateContext();

  const handleDownload = () => {
    onValue(ref(db, "/"), (snapshot) => {
      const data = JSON.stringify(snapshot);
      const link = document.createElement("a");

      link.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(data)
      );
      link.setAttribute("download", "db-mollusca-backup.json");
      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    });
  };

  const handleClick = () => {
    if (currentLocality) {
      window.sessionStorage.clear();
      setCurrentLocality("");
      setLocalityData(null);
    }
  };

  return (
    <div className="topbar">
      <NavLink
        to={routes.home}
        onClick={handleClick}
        className={({ isActive }) =>
          isActive ? "topbar-item active" : "topbar-item"
        }
      >
        Add new
      </NavLink>
      <NavLink
        onClick={handleClick}
        to={routes.localities}
        className={({ isActive }) =>
          isActive ? "topbar-item active" : "topbar-item"
        }
      >
        Localities
      </NavLink>
      <NavLink
        onClick={handleClick}
        to={routes.species}
        className={({ isActive }) =>
          isActive ? "topbar-item active" : "topbar-item"
        }
      >
        Species
      </NavLink>
      <NavLink
        onClick={handleClick}
        to={routes.localitiesAndSpecies}
        className={({ isActive }) =>
          isActive ? "topbar-item active" : "topbar-item"
        }
      >
        Localities & Species
      </NavLink>
      <NavLink
        onClick={handleClick}
        to={routes.speciesNames}
        className={({ isActive }) =>
          isActive ? "topbar-item active" : "topbar-item"
        }
      >
        Species names
      </NavLink>
      <button className="export" onClick={() => handleDownload()}>
        Export all
      </button>
    </div>
  );
};

export default TopBar;
