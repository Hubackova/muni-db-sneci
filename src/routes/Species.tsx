// @ts-nocheck
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import SpeciesTable from "../components/tables/SpeciesTable";
import { getAll } from "../helpers/utils";
import "./HomePage.scss";
import "./Table.scss";

const Species: React.FC = () => {
  const [species, setSpecies] = useState<any[]>([]);
  const [speciesNames, setSpeciesNames] = useState<any[]>([]);
  const db = getDatabase();

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
    if (!speciesNames.length) return;
    onValue(ref(db, "localities/"), (snapshot) => {
      const items: any = [];
      snapshot.forEach((child) => {
        let childItem = child.val();
        childItem.key = child.key;
        if (childItem.species) {
          const speciesValues = Object.values(childItem.species);
          speciesValues.forEach((species) => {
            items.push({
              ...species,
              all: getAll(species),
              siteId: childItem.siteId,
              siteKey: childItem.key,
              speciesNameKey: species.speciesNameKey,
              speciesKey: species.speciesKey,
              key: species.speciesNameKey,
              speciesNamesKeysinLocality: speciesValues.map(
                (i) => i.speciesNameKey
              ),
              speciesName:
                speciesNames.find((i) => i.key === species.speciesNameKey)
                  ?.speciesName || "0",
              dateSampling: childItem.dateSampling,
            });
          });
        }
      });
      setSpecies(items);
    });
  }, [db, speciesNames]);
  if (!species.length || !speciesNames.length) return <div>no data</div>;
  const sortedSpecies = species.sort(function (a, b) {
    //todo
    if (new Date(a.dateSampling) < new Date(b.dateSampling)) {
      return 1;
    }
    if (new Date(a.dateSampling) > new Date(b.dateSampling)) {
      return -1;
    }
    return a.speciesName.localeCompare(b.speciesName);
  });

  return <SpeciesTable species={sortedSpecies} />;
};

export default Species;
