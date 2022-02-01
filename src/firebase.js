// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlmwyIpvDXEbydYr80xTxqgP8x1KtoVBs",
    authDomain: "insta-739c3.firebaseapp.com",
    projectId: "insta-739c3",
    storageBucket: "insta-739c3.appspot.com",
    messagingSenderId: "309044030976",
    appId: "1:309044030976:web:0ba443e637c501958eb2e5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

const firestore = firebase.firestore()
export const database = {
    users: firestore.collection('users'),
    posts: firestore.collection('posts'),
    comments : firestore.collection('comments'),
    getTimeStamp : firebase.firestore.FieldValue.serverTimestamp,
}
export const storage = firebase.storage()