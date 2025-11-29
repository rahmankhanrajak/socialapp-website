// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5_p08FSvLEJlDlSUw-N2T5oz10LXHNqI",
  authDomain: "socialapp-auth-f8c45.firebaseapp.com",
  projectId: "socialapp-auth-f8c45",
  storageBucket: "socialapp-auth-f8c45.firebasestorage.app",
  messagingSenderId: "937774219772",
  appId: "1:937774219772:web:edc0beb0ae7047e0dff279"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);









// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "<YOUR_API_KEY>",
//   authDomain: "<YOUR_PROJECT_ID>.firebaseapp.com",
//   projectId: "<YOUR_PROJECT_ID>",
//   storageBucket: "<YOUR_PROJECT_ID>.appspot.com",
//   messagingSenderId: "<SENDER_ID>",
//   appId: "<APP_ID>"
// };

// // initialize Firebase app once
// const app = initializeApp(firebaseConfig);

// // export auth and helper to create recaptcha
// const auth = getAuth(app);

// /**
//  * Creates a RecaptchaVerifier attached to the DOM element with id 'recaptcha-container'.
//  * We set size to 'invisible' so it doesn't show unless Firebase needs it.
//  * Call createRecaptcha() before signInWithPhoneNumber.
//  */
// function createRecaptcha(containerId = "recaptcha-container") {
//   try {
//     // If already exists, reuse (firebase stores it on window)
//     if (window.recaptchaVerifier) {
//       return window.recaptchaVerifier;
//     }
//     window.recaptchaVerifier = new RecaptchaVerifier(
//       containerId,
//       {
//         size: "invisible", // or "normal" to show widget
//         callback: (response) => {
//           // reCAPTCHA solved — will proceed with signInWithPhoneNumber
//         },
//       },
//       auth
//     );
//     return window.recaptchaVerifier;
//   } catch (e) {
//     console.error("Failed to create reCAPTCHA", e);
//     throw e;
//   }
// }

// export { app, auth, createRecaptcha, signInWithPhoneNumber };
