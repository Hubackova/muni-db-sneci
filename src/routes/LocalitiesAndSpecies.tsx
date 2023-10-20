// @ts-nocheck
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import LocalitiesAndSpeciesTable from "../components/tables/LocalitiesAndSpeciesTable";
import "./HomePage.scss";
import "./Table.scss";

const LocalitiesAndSpecies: React.FC = () => {
  const [localities, setLocalities] = useState<any[]>([]);
  const db = getDatabase();
  const [speciesNames, setSpeciesNames] = useState<any[]>([]);

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

  useEffect(() => {
    onValue(ref(db, "localities/"), (snapshot) => {
      const items: any = [];
      snapshot.forEach((child) => {
        let childItem = child.val();
        childItem.key = child.key;
        if (childItem.species) {
          const speciesValues = Object.values(childItem.species);
          if (speciesValues.length)
            speciesValues.forEach((speciesData) => {
              items.push({
                ...childItem,
                ...speciesData,
                all:
                  parseInt(speciesData.empty || 0) +
                  parseInt(speciesData.live || 0) +
                  parseInt(speciesData.undefined || 0),
                siteId: childItem.siteId,
                key: childItem.key + speciesData.speciesNameKey,
                siteKey: childItem.key,
                speciesNameKey: speciesData.speciesNameKey,
                speciesKey: speciesData.speciesKey,
              });
            });
        }
      });
      setLocalities(items);
    });
  }, [db]);
  if (!localities.length || !speciesNames.length) return <div>no data</div>;

  return (
    <LocalitiesAndSpeciesTable
      localities={localities}
      speciesNames={speciesNames}
    />
  );
};

export default LocalitiesAndSpecies;
