// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// Create a root reference

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcMYaXHrnZizg1vUC0KZeFm9faevoYlFk",
    authDomain: "realtime-chatconnect.firebaseapp.com",
    projectId: "realtime-chatconnect",
    storageBucket: "realtime-chatconnect.appspot.com",
    messagingSenderId: "765764180609",
    appId: "1:765764180609:web:750db1f11a10040b0a4b80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const storage = getStorage();
const db = getFirestore(app);
export { app, auth, storage, db }