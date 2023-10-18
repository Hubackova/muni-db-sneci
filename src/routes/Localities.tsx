// @ts-nocheck
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import LocalitiesTable from "../components/tables/LocalitiesTable";
import "./HomePage.scss";
import "./Table.scss";

const Localities: React.FC = () => {
  const [localities, setLocalities] = useState<any[]>([]);
  const db = getDatabase();

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

  if (!localities.length) return <div>no data</div>;
  return <LocalitiesTable localities={localities} />;
};

export default Localities;
