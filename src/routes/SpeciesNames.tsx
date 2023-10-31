// @ts-nocheck
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import SpeciesNamesTable from "../components/tables/SpeciesNamesTable";
import "./HomePage.scss";
import "./Table.scss";

const SpeciesNames: React.FC = () => {
  const [species, setSpecies] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const db = getDatabase();

  useEffect(() => {
    onValue(ref(db, "species/"), (snapshot) => {
      const items: any = [];
      snapshot.forEach((child) => {
        let childItem = child.val();
        childItem.key = child.key;
        items.push(childItem);
      });
      setSpecies(items);
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
                  parseInt(speciesData.undefined || 0) +
                  parseInt(speciesData.live || 0),
                key: childItem.key + speciesData.speciesKey,
                siteKey: childItem.key,
              });
            });
        }
      });
      setLocalities(items);
    });
  }, [db]);

  if (!species.length || !localities.length) return <div>no data</div>;

  const speciesSorted = species.sort(function (a, b) {
    if (a.speciesName < b.speciesName) {
      return -1;
    }
    if (a.speciesName > b.speciesName) {
      return 1;
    }
    return 0;
  });
  return <SpeciesNamesTable species={speciesSorted} localities={localities} />;
};

export default SpeciesNames;
