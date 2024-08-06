// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7NPpjT-A33Q0vXhMOOTW3TdhR4yM2VPM",
  authDomain: "inventory-manager-526d0.firebaseapp.com",
  projectId: "inventory-manager-526d0",
  storageBucket: "inventory-manager-526d0.appspot.com",
  messagingSenderId: "645952207864",
  appId: "1:645952207864:web:85a2e78504435f976f340d",
  measurementId: "G-8VKGTMXRHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}