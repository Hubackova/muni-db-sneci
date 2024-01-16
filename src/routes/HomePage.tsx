// @ts-nocheck
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useAppStateContext } from "../AppStateContext";
import NewLocalityForm from "../components/forms/NewLocalityForm";
import NewSpeciesForm from "../components/forms/NewSpeciesForm";
import SpeciesAtLocalityForm from "../components/forms/SpeciesAtLocalityForm";
import SpeciesTableHome from "../components/tables/SpeciesTableHome";
import { getAll, getLocalityName, getOptions } from "../helpers/utils";
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
        items.push({
          ...childItem,
          speciesNamesKeysinLocality: childItem.species?.length
            ? childItem.species.map((i) => i.speciesNameKey)
            : [],
        });
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
    all: getAll(species),
    siteId: activeLocality.siteId,
  }));

  if (!localities) return <div>Loading...</div>;
  const currentLocalityItem = localities.find((i) => i.key === currentLocality);
  let currentLocalitySpecies = [];
  if (currentLocalityItem && currentLocalityItem.species) {
    currentLocalitySpecies = Object.values(currentLocalityItem.species).map(
      (i) => i.speciesNameKey
    );
  }
  const filteredSpeciesNames = speciesNames.filter(
    (i) => !currentLocalitySpecies.includes(i.key)
  );
  const allSpecies = [];
  localities.forEach((i) =>
    allSpecies.push(i.species && Object.values(i.species))
  );
  const specificationOptions = getOptions(
    allSpecies.flat().filter((i) => !!i),
    "specification"
  );
  const isLocalityWithZero =
    speciesData.length === 1 && speciesData[0].speciesNameKey === "0";
  return (
    <>
      <div className="main-wrapper">
        <div className="form-wrapper">
          <NewLocalityForm localities={localities} />
        </div>
        {currentLocality && (
          <div className="table-wrapper">
            {localities && currentLocality && !!species.length && (
              <>
                <h5>
                  Species at locality:{" "}
                  {getLocalityName(localities, currentLocality)}
                </h5>
                <br />
                <SpeciesTableHome
                  species={speciesData}
                  speciesNames={speciesNames}
                />
              </>
            )}
            {!species.length && (
              <h5>
                Add species to locality:{" "}
                {getLocalityName(localities, currentLocality)}
              </h5>
            )}
            {!isLocalityWithZero && (
              <SpeciesAtLocalityForm
                withLabels={!species.length}
                speciesNames={filteredSpeciesNames}
                specificationOptions={specificationOptions}
                withZero={!speciesData.length}
                localities={localities}
              />
            )}
          </div>
        )}
      </div>
      <div className="bottom">
        <NewSpeciesForm speciesNames={speciesNames} />
      </div>
    </>
  );
};

export default HomePage;
