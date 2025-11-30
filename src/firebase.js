import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5_p08FSvLEJlDlSUw-N2T5oz10LXHNqI",
  authDomain: "socialapp-auth-f8c45.firebaseapp.com",
  projectId: "socialapp-auth-f8c45",
  storageBucket: "socialapp-auth-f8c45.firebasestorage.app",
  messagingSenderId: "937774219772",
  appId: "1:937774219772:web:edc0beb0ae7047e0dff279"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export function resetRecaptcha() {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear && window.recaptchaVerifier.clear();
    } catch (_) {}

    window.recaptchaVerifier = null;
  }
}

export function setupRecaptcha() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",   
      {
        size: "invisible",
      }
    );
  }
  return window.recaptchaVerifier;
}