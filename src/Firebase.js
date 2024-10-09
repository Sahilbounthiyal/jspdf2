import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBxiQFBmY3a9sbdAJ1NpyvmWCiG0u7gflI",
    authDomain: "pdfify-a014b.firebaseapp.com",
    projectId: "pdfify-a014b",
    storageBucket: "pdfify-a014b.appspot.com",
    messagingSenderId: "464203429233",
    appId: "1:464203429233:web:90644d0790210a15fbb2d0",
    databaseURL:"https://pdfify-a014b-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
