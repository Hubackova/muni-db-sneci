const { data } = require("./species");
const { initializeApp } = require("firebase/app");
const { onValue, ref, getDatabase } = require("firebase/database");

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

initializeApp(firebaseConfig);

const db = getDatabase();

function fetchSpeciesNames() {
  return new Promise((resolve) => {
    const speciesNames = [];
    onValue(ref(db, "species/"), (snapshot) => {
      snapshot.forEach((child) => {
        let childItem = child.val();
        childItem.key = child.key;
        speciesNames.push(childItem);
      });
      resolve(speciesNames);
    });
  });
}

function fetchLocalities() {
  return new Promise((resolve) => {
    const localities = [];
    onValue(ref(db, "localities/"), (snapshot) => {
      snapshot.forEach((child) => {
        let childItem = child.val();
        localities.push(childItem.siteId);
      });
      resolve(localities);
    });
  });
}

async function checkSpeciesNames() {
  const speciesNames = await fetchSpeciesNames();
  const names = speciesNames.map((i) => i.speciesName);

  for (let element of data) {
    if (!names.includes(element.speciesName)) {
      throw new Error(
        `Error: Tento druh není v seznamu druhů: ${element.speciesName}`
      );
    }
  }
}

async function getLocalities() {
  const siteIds = await fetchLocalities();

  for (let element of data) {
    if (!siteIds.includes(element.siteId)) {
      throw new Error(
        `Error: Lokalita s tímto siteID "${element.siteId}" neexistuje`
      );
    }
  }
}

async function validate() {
  try {
    // Nejprve zkontrolujeme jména druhů
    await checkSpeciesNames();

    // Poté zkontrolujeme lokalitu
    await getLocalities();

    // Pokud vše proběhlo úspěšně, vypíše se zpráva
    console.log("Vše je v pořádku, celkem " + data.length + " druhů k importu");

    // Kontrola, zda není překročen limit na 500 položek
    if (data.length > 500) {
      console.log(
        "Warning: raději import rozdělit na části po max 500 položek"
      );
    }

    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

validate();
