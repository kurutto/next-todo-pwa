import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APP_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_APP_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const provider = new GoogleAuthProvider();
export const auth = getAuth();
export const logIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result.user)
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      // The signed-in user info.
      // const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      console.log(error)
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

export const logOut = () => {
  signOut(auth)
    .then(() => {
      document.location.reload();
    })
    .catch((err) => {
      console.log("サインアウトエラー");
    });
};
