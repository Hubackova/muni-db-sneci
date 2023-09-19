// @ts-nocheck

import { getDatabase, onValue, ref } from "firebase/database";
import React from "react";
import { NavLink } from "react-router-dom";
import routes from "../routes";
import "./TopBar.scss";

const TopBar: React.FC = () => {
  const db = getDatabase();

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

  return (
    <div className="topbar">
      <NavLink
        to={routes.home}
        className={({ isActive }) =>
          isActive ? "topbar-item active" : "topbar-item"
        }
      >
        Add new
      </NavLink>
      <NavLink
        to={routes.localities}
        className={({ isActive }) =>
          isActive ? "topbar-item active" : "topbar-item"
        }
      >
        Localities
      </NavLink>
      <NavLink
        to={routes.species}
        className={({ isActive }) =>
          isActive ? "topbar-item active" : "topbar-item"
        }
      >
        Species
      </NavLink>
      <NavLink
        to={routes.localitiesAndSpecies}
        className={({ isActive }) =>
          isActive ? "topbar-item active" : "topbar-item"
        }
      >
        Localities & Species
      </NavLink>
      <NavLink
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
