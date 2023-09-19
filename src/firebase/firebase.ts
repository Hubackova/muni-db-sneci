// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { child, getDatabase, push, ref, set } from "firebase/database";
import { DnaExtractionsType } from "../types";
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
function writeLocalityData(extractionItem: DnaExtractionsType) {
  const db = getDatabase();
  const newKey = push(child(ref(db), "localities")).key;
  set(ref(db, "localities/" + newKey), extractionItem);
  sessionStorage.setItem("activeLoc", newKey as string);
}
function writeSpeciesData(extractionItem: DnaExtractionsType) {
  const db = getDatabase();
  const newKey = push(child(ref(db), "species")).key;
  set(ref(db, "species/" + newKey), extractionItem);
}
function writeSpeciesToLocalityData(extractionItem: DnaExtractionsType) {
  const db = getDatabase();
  console.log("writeSpeciesToLocalityData", extractionItem);
  let locKey = sessionStorage.getItem("activeLoc");
  console.log(locKey);
  const newKey = push(child(ref(db), "localities/" + locKey + "/species")).key;
  console.log(newKey);
  set(ref(db, "localities/" + locKey + "/species/" + newKey), extractionItem);
}
export {
  localities,
  species,
  writeLocalityData,
  writeSpeciesData,
  writeSpeciesToLocalityData,
};
