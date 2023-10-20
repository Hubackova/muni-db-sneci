// @ts-nocheck
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useAppStateContext } from "../AppStateContext";
import NewLocalityForm from "../components/forms/NewLocalityForm";
import NewSpeciesForm from "../components/forms/NewSpeciesForm";
import SpeciesAtLocalityForm from "../components/forms/SpeciesAtLocalityForm";
import SpeciesTable from "../components/tables/SpeciesTable";
import { getLocalityName } from "../helpers/utils";
import "./HomePage.scss";
import "./Table.scss";

const HomePage: React.FC = () => {
  const [localities, setLocalities] = useState<any[]>([]);
  const [speciesNames, setSpeciesNames] = useState<any[]>([]);
  const db = getDatabase();
  const { currentLocality } = useAppStateContext();

  useEffect(() => {
    onValue(ref(db, "localities/"), (snapshot) => {
      const items: any = [];
      snapshot.forEach((child) => {
        let childItem = child.val();
        childItem.key = child.key;
        items.push(childItem);
      });
      setLocalities(items);
    });
  }, [db]);

  useEffect(() => {
    onValue(ref(db, "species/"), (snapshot) => {
      const items: any = [];
      snapshot.forEach((child) => {
        let childItem = child.val();
        childItem.key = child.key;
        items.push(childItem);
      });
      setSpeciesNames(items);
    });
  }, [db]);

  const activeLocality = localities.find(
    (locality) => locality.key === currentLocality
  );
  const species = activeLocality?.species
    ? Object.values(activeLocality.species)
    : [];

  const speciesData = species.map((species) => ({
    ...species,
    all:
      parseInt(species.empty || 0) +
      parseInt(species.live || 0) +
      parseInt(species.undefined || 0),
    siteId: activeLocality.siteId,
  }));

  if (!localities) return <div>Loading...</div>;

  return (
    <>
      <div className="main-wrapper">
        <div className="form-wrapper">
          <NewLocalityForm localities={localities} />
        </div>
        {currentLocality ? (
          <div className="table-wrapper">
            {localities && currentLocality && !!species.length && (
              <>
                <h5>
                  Species at locality:{" "}
                  {getLocalityName(localities, currentLocality)}
                </h5>
                <br />
                <SpeciesTable
                  species={speciesData}
                  speciesNames={speciesNames}
                  compact
                />
              </>
            )}
            {!species.length && (
              <h5>
                Add species to locality:{" "}
                {getLocalityName(localities, currentLocality)}
              </h5>
            )}
            <SpeciesAtLocalityForm
              compact
              withLabels={!species.length}
              speciesNames={speciesNames}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="bottom">
        <NewSpeciesForm speciesNames={speciesNames} />
      </div>
    </>
  );
};

export default HomePage;
