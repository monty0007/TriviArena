// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOLXQxWeVzeNK4nQvjhhPoOpz6YrAhNdw",
  authDomain: "login-auth-54c3e.firebaseapp.com",
  projectId: "login-auth-54c3e",
  storageBucket: "login-auth-54c3e.appspot.com",
  messagingSenderId: "85760462139",
  appId: "1:85760462139:web:c743170234b91606b67b1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth()
export const db=getFirestore(app)
export default app