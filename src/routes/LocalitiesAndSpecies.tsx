// @ts-nocheck
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import LocalitiesAndSpeciesTable from "../components/tables/LocalitiesAndSpeciesTable";
import "./HomePage.scss";
import "./Table.scss";

const LocalitiesAndSpecies: React.FC = () => {
  const [localities, setLocalities] = useState<any[]>([]);
  const db = getDatabase();

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
                key: childItem.siteId + speciesData.speciesName,
              });
            });
        }
      });
      setLocalities(items);
    });
  }, [db]);
  if (!localities.length) return <div>no data</div>;
  console.log(localities);
  return <LocalitiesAndSpeciesTable localities={localities} />;
};

export default LocalitiesAndSpecies;
