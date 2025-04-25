import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// DO NOT USE THE firebaseConfig CONFIGURATION IN PRODUCTION WITHOUT MODIFYING WITH YOURS!!!
// Or every single thing will be in mine firebase instead :D
// Better to check the official documentation:
// https://firebase.google.com/docs/web/setup?hl=en&authuser=0

const firebaseConfig = {
  apiKey: "AIzaSyBh0-jhJmKAS0EO0gNlmpkTI2n_ITFnGdM",
  authDomain: "fb-databaseg.firebaseapp.com",
  projectId: "fb-databaseg",
  storageBucket: "fb-databaseg.firebasestorage.app",
  messagingSenderId: "1061518329464",
  appId: "1:1061518329464:web:bc7cae3d0b4c7d6f270f8d",
  measurementId: "G-RVWTG91JKS",
};

// Initialize Firebase here. Nothing interesting here :/
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
