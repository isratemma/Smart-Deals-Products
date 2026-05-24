// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyApN_JnH3wB_pKDnzfVxMLs3eGrxVOiaqI',
  authDomain: 'smart-deals-2202e.firebaseapp.com',
  projectId: 'smart-deals-2202e',
  storageBucket: 'smart-deals-2202e.firebasestorage.app',
  messagingSenderId: '475515980850',
  appId: '1:475515980850:web:3d17092db751c1bb03402b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
