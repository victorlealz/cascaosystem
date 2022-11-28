import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCXMezkWeky8bUxOfKxiyAjGyhZ02ugRek",
    authDomain: "cascaovendas.firebaseapp.com",
    projectId: "cascaovendas",
    storageBucket: "cascaovendas.appspot.com",
    messagingSenderId: "1086288357191",
    appId: "1:1086288357191:web:bf262bea276dfd3dfb0e62",
    measurementId: "G-77EHEKJ5DH"
};

//Init firebase app
const app = initializeApp(firebaseConfig);

//init services
export const db = getFirestore(app);

//collection ref
const colRef = collection(db, 'products')

//get collection data
getDocs(colRef)
    .then((snapshot) => {
        let productsList = []
        snapshot.docs.forEach((doc) => {
            productsList.push({ ...doc.data(), id: doc.id })
        })
    })
    .catch(err => {
        console.log(err.message)
    });

    
