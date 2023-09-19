// @ts-nocheck
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import SpeciesNamesTable from "../components/tables/SpeciesNamesTable";
import "./HomePage.scss";
import "./Table.scss";

const SpeciesNames: React.FC = () => {
  const [species, setSpecies] = useState<any[]>([]);
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
  if (!species.length) return <div>no data</div>;
  return <SpeciesNamesTable species={species} />;
};

export default SpeciesNames;
