importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js')


const config = {
    apiKey: "AIzaSyBXoiQX_cBgTluL95YetKNfw8SeGhq88pQ",
    authDomain: "matrix03-986c6.firebaseapp.com",
    projectId: "matrix03-986c6",
    storageBucket: "matrix03-986c6.appspot.com",
    messagingSenderId: "829905375780",
    appId: "1:829905375780:web:8c8db4977745c97037beb1",
    measurementId: "G-56W7BF4H2L"
}

firebase.initializeApp(config)

const initMessaging = firebase.messaging()