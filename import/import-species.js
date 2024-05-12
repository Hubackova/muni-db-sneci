const { initializeApp } = require("firebase/app");
const { getDatabase, push, ref, set, onValue } = require("firebase/database");
const { data } = require("./species");

// ideální je, pokud má tabulka na import do 500 řádků. pokud ne, raději ho rozdělíme. tj. přepíšeme následující řádek na:
// const dataChunk = data.slice(0, 499);
// jakmile import doběhne, tak na data.slice(500, 999)*}
const dataChunk = data.slice(0, data.length);

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

function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

function writeSpeciesToLocalityData(data, locKey) {
  const newSpeciesKey = push(ref(db, "species")).key;
  return set(ref(db, `localities/${locKey}/species/${newSpeciesKey}`), {
    ...data,
    speciesKey: newSpeciesKey,
  });
}

function fetchLocalities() {
  return new Promise((resolve) => {
    const localities = [];
    onValue(ref(db, "localities/"), (snapshot) => {
      snapshot.forEach((child) => {
        let childItem = child.val();
        childItem.key = child.key;
        localities.push({
          ...childItem,
          speciesNamesKeysinLocality: childItem.species?.length
            ? childItem.species.map((i) => i.speciesNameKey)
            : [],
        });
      });
      resolve(localities);
    });
  });
}

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

async function processItem(i, speciesNames, localities) {
  const { speciesName, siteId, ...data } = i;
  data.speciesNameKey = speciesNames.find(
    (species) => species.speciesName === i.speciesName
  )?.key;
  const localityKey = localities.find((loc) => loc.siteId === i.siteId)?.key;
  if (localityKey) {
    await writeSpeciesToLocalityData(data, localityKey);
  }
}

async function processItemsSequentially(items, speciesNames, localities) {
  for (const item of items) {
    await processItem(item, speciesNames, localities);
  }
}

async function importData() {
  const speciesNames = await fetchSpeciesNames();
  const localities = await fetchLocalities();
  const concurrencyLimit = 25;
  const chunks = chunk(dataChunk, concurrencyLimit);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    await processItemsSequentially(chunk, speciesNames, localities);
  }
  console.log("done");
}

importData();
