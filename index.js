
//dependencies
import express from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore";
import { getFirestore as getFirestoreLite, collection as collectionLite, getDocs, updateDoc } from 'firebase/firestore/lite';
 

const firebaseConfig = {
    apiKey: "AIzaSyA5D7qVxtaxppmIwBVJVxZRS3ycMmuakfo",
    authDomain: "race-car-tracking-app.firebaseapp.com",
    projectId: "race-car-tracking-app",
    storageBucket: "race-car-tracking-app.appspot.com",
    messagingSenderId: "262290781468",
    appId: "1:262290781468:web:506776e0beac470190b6d9"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const api = express();
const dblite = getFirestoreLite(firebaseApp);

//Function to read DB
async function getCollection(db, colName) {
const dataCol = collectionLite(db, colName); //create a reference 
const dataSnapshot = await getDocs(dataCol); //resolve the refernce and get the snapshot
const DataList = dataSnapshot.docs.map(doc => doc.data());
return DataList;
}

//Function to write to DB - Hard code
async function addToCollection(db, colName) {
    const data = {
            studentName: 'Ama',
            age: 24
    };
    const UUID = (new Date()).getTime();
    await setDoc(doc(db, colName, UUID.toString()), data);
}

//Function to write to DB 
async function writeData(db, colName, req) {

    const data = {

        latitude: req.body.latitude,
        longitude: req.body.longitude,
        altitude: req.body.altitude,
        speed: req.body.speed,
        time: req.body.time
    }

   const UUID = (new Date()).getTime();
    await setDoc(doc(db, colName, UUID.toString()), data);
}

api.get('/db', (req, res) => {
    getCollection(dblite, "carData").then(
        value => { res.send(value); }
    ).catch(
        err => {
            res.send("Error reading from DB - GET/db");
            console.log(err);
        }
    )
});

api.use(express.json());

//Handling Get request for / URI
api.get('/', (req, res) => {
    res.send('Express App Running');
});

api.get('/db', (req, res) => {
    getCollection(db, "carData").then(
    value => {res.send(value);}
).catch(
    err => {
    res.send("Error reading from DB - GET/db");
    console.log(err);
}
)

});

// api.put('/db', (req, res) => {
//     addToCollection(db, "carData").then(
//         value => { res.send("Done"); }
//     ).catch(
//         err => {
//             res.send("Error writing to DB - put/db");
//             console.log(err);
//         }
//     )
// });

api.post('/write', (req, res) => {
    console.log("POST");
    writeData(db, "carData", req).then(
        value => { res.send("Done"); }
    ).catch(
        err => {
            res.send("Error writing to DB - POST/write");
            console.log(err);
        }
    )
});


const port = process.env.PORT || 8080;
api.listen(port, () => console.log(`Express server listening on port
${port}`));
