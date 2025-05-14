// @ts-nocheck
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import LocalitiesAndSpeciesTable from "../components/tables/LocalitiesAndSpeciesTable";
import { getAll } from "../helpers/utils";
import "./HomePage.scss";
import "./Table.scss";
import { v4 as uuidv4 } from "uuid";

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
    if (!speciesNames.length) return;
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
                specification: speciesData.specification,
                live: speciesData.live,
                empty: speciesData.empty,
                undef: speciesData.undef,
                lot: speciesData.lot,
                vouchers: speciesData.vouchers,
                all: getAll(speciesData),
                siteId: childItem.siteId,
                key: uuidv4(),
                noteSpecies: speciesData.note,
                siteKey: childItem.key,
                speciesNameKey: speciesData.speciesNameKey,
                speciesKey: speciesData.speciesKey,
                speciesName:
                  speciesNames.find((i) => i.key === speciesData.speciesNameKey)
                    ?.speciesName || "0",
                speciesNamesKeysinLocality: speciesValues.map(
                  (i) => i.speciesNameKey
                ),
              });
            });
        }
      });
      setLocalities(items);
    });
  }, [db, speciesNames]);
  if (!localities.length || !speciesNames.length)
    return <div>no data / loading...</div>;
  const sortedLocalities = localities.sort(function (a, b) {
    if (new Date(a.dateSampling) < new Date(b.dateSampling)) {
      return 1;
    }
    if (new Date(a.dateSampling) > new Date(b.dateSampling)) {
      return -1;
    }
    return a.speciesName.localeCompare(b.speciesName);
  });

  return (
    <LocalitiesAndSpeciesTable
      localities={sortedLocalities}
      speciesNames={speciesNames}
    />
  );
};

export default LocalitiesAndSpecies;
