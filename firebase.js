// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdBrQCNMTiinBe-THEt3uWzvgQwlZl9iQ",
  authDomain: "inventory-management-23fb2.firebaseapp.com",
  projectId: "inventory-management-23fb2",
  storageBucket: "inventory-management-23fb2.appspot.com",
  messagingSenderId: "11109334025",
  appId: "1:11109334025:web:9674d76417f5a020d1ccd8",
  measurementId: "G-9PJ938REL8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore=getFirestore(app);

export {firestore};