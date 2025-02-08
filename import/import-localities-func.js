const { initializeApp } = require("firebase/app");
const { child, getDatabase, push, ref, set } = require("firebase/database");
const { data } = require("./localities");

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

function writeLocalityData(data) {
  const db = getDatabase();
  const newKey = push(child(ref(db), "localities")).key;
  set(ref(db, "localities/" + newKey), { ...data, key: newKey });
  return newKey;
}

const importData = () => {
  data.forEach((i) => {
    writeLocalityData(i);
  });
  console.log("done", data.length);
};

importData();
