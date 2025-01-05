import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBIj_xAfwL4oAC-qvX6ZJDJGELIk7VV2AU",
  authDomain: "sparklealigner.firebaseapp.com",
  projectId: "sparklealigner",
  storageBucket: "sparklealigner.firebasestorage.app",
  messagingSenderId: "615343035817",
  appId: "1:615343035817:web:729fb33dc527a6402f60b8",
  measurementId: "G-2TK2YSDRVJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
