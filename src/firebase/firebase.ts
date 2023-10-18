// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { child, getDatabase, push, ref, set } from "firebase/database";
import { removeUndefinedKeys } from "../helpers/utils";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCzBphCVqHbMObpeq9PrQYfnoB4FCp8ggg",

  authDomain: "mollusca-91521.firebaseapp.com",

  databaseURL:
    "https://mollusca-91521-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "mollusca-91521",

  storageBucket: "mollusca-91521.appspot.com",

  messagingSenderId: "413904187659",

  appId: "1:413904187659:web:1185b60cd9fc28f31c320e",

  measurementId: "G-VDBLFE43C3",
};

// Initialize Firebase

initializeApp(firebaseConfig);
const db = getDatabase();
const localities = ref(db, "localities/");
const species = ref(db, "species/");
function writeLocalityData(data: any) {
  const db = getDatabase();
  const newKey = push(child(ref(db), "localities")).key;
  set(ref(db, "localities/" + newKey), { ...data, key: newKey });
  return newKey;
}
function writeSpeciesNameData(data: any) {
  const db = getDatabase();
  const key = push(child(ref(db), "species")).key;
  set(ref(db, "species/" + key), { ...data, key: key });
}
function writeSpeciesToLocalityData(data: any, locKey: string) {
  const db = getDatabase();
  const newSpeciesKey = push(child(ref(db), "species")).key;
  const cleanData = removeUndefinedKeys(data);
  console.log(cleanData);
  set(ref(db, "localities/" + locKey + "/species/" + newSpeciesKey), {
    ...cleanData,
    speciesKey: newSpeciesKey,
  });
}
export {
  localities,
  species,
  writeLocalityData,
  writeSpeciesNameData,
  writeSpeciesToLocalityData,
};
