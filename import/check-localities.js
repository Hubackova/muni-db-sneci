const { data } = require("./localities");
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

const siteIds = data.map((i) => i.siteId);

// Zkontroluj duplicity až po validaci
async function getLocalities() {
  const localities = await fetchLocalities();
  const commonElement = localities.find((element) => siteIds.includes(element));

  return commonElement; // Vracení duplicity pro kontrolu po validaci
}

async function validate() {
  try {
    // Nejprve prověř všechny objekty
    data.forEach((i) => {
      validateObject(i);
    });

    // Poté prověř duplicity
    const commonElement = await getLocalities();

    if (commonElement) {
      throw new Error(`Error: Duplicate SiteId: ${commonElement}`);
    } else {
      console.log("Vsechno je to v pohode, celkem " + data.length + " lokalit");
      process.exit(0);
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

validate();

function validateObject(obj) {
  const {
    siteId,
    siteName,
    latitude,
    longitude,
    mapGrid,
    elevation,
    dateSampling,
    collector,
    distanceForest,
    sampleSize,
    habitatSize,
    plotSize,
    dataType,
    waterConductivity,
    waterPH,
    releveNumber,
    lotNumber,
  } = obj;

  const stringifiedObj = JSON.stringify(obj);
  if (!siteId) {
    throw new Error(
      `siteId is required - check this object: ${stringifiedObj}}`
    );
  }
  if (!siteName) {
    throw new Error(
      `siteName is required - check this object: ${stringifiedObj}}`
    );
  }
  if (!latitude) {
    throw new Error(
      `latitude is required - check this object: ${stringifiedObj}}`
    );
  }
  if (!longitude) {
    throw new Error(
      `longitude is required - check this object: ${stringifiedObj}}`
    );
  }
  if (typeof latitude !== "number" && latitude !== "na") {
    throw new Error(
      `latitude should be a number or na - check this object: ${stringifiedObj}}`
    );
  }
  if (typeof longitude !== "number" && latitude !== "na") {
    throw new Error(
      `longitude should be a number or na  - check this object: ${stringifiedObj}}`
    );
  }
  if (mapGrid && typeof mapGrid !== "number") {
    throw new Error(
      `mapGrid should be a number - check this object: ${stringifiedObj}}`
    );
  }
  if (elevation && typeof elevation !== "number") {
    throw new Error(
      `elevation should be a number - check this object: ${stringifiedObj}}`
    );
  }
  if (!dateSampling) {
    throw new Error(
      `dateSampling  is required - check this object: ${stringifiedObj}}`
    );
  }
  if (!collector) {
    throw new Error(
      `collector  is required - check this object: ${stringifiedObj}}`
    );
  }
  if (plotSize && typeof plotSize !== "number") {
    throw new Error(
      `plotSize should be a number - check this object: ${stringifiedObj}}`
    );
  }
  if (sampleSize && typeof sampleSize !== "number") {
    throw new Error(
      `sampleSize should be a number - check this object: ${stringifiedObj}}`
    );
  }
  if (habitatSize && typeof habitatSize !== "number") {
    throw new Error(
      `habitatSize should be a number - check this object: ${stringifiedObj}}`
    );
  }
  if (distanceForest && typeof distanceForest !== "number") {
    throw new Error(
      `distanceForest should be a number - check this object: ${stringifiedObj}}`
    );
  }
  if (releveNumber && typeof releveNumber !== "number") {
    throw new Error(
      `releveNumber should be a number - check this object: ${stringifiedObj}}`
    );
  }
  if (lotNumber && typeof lotNumber !== "number") {
    throw new Error(
      `lotNumber should be a number - check this object: ${stringifiedObj}}`
    );
  }
  if (waterPH && typeof waterPH !== "number") {
    throw new Error(
      `waterPH should be a number - check this object: ${stringifiedObj}}`
    );
  }
  if (waterConductivity && typeof waterConductivity !== "number") {
    throw new Error(
      `waterConductivity should be a number - check this object: ${stringifiedObj}}`
    );
  }
  if (!dataType) {
    throw new Error(
      `dataType  is required - check this object: ${stringifiedObj}}`
    );
  }
  if (!/^(\d{4}|\d{4}-\d{2}|\d{4}-\d{2}-\d{2}|na)$/.test(dateSampling)) {
    throw new Error(
      `dateSampling has wrong format - check this object: ${stringifiedObj}}`
    );
  }
}
