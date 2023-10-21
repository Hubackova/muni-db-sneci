// @ts-nocheck
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import SpeciesTable from "../components/tables/SpeciesTable";
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
              all:
                parseInt(species.empty || 0) +
                parseInt(species.live || 0) +
                parseInt(species.undefined || 0),
              siteId: childItem.siteId,
              siteKey: childItem.key,
              speciesNameKey: species.speciesNameKey,
              speciesKey: species.speciesKey,
              key: species.speciesNameKey,
              speciesNamesKeysinLocality: speciesValues.map(
                (i) => i.speciesNameKey
              ),
            });
          });
        }
      });
      setSpecies(items);
    });
  }, [db]);
  if (!species.length || !speciesNames.length) return <div>no data</div>;

  return <SpeciesTable species={species} speciesNames={speciesNames} />;
};

export default Species;
