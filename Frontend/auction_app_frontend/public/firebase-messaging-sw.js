importScripts("https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.4.3/firebase-messaging.js");

var firebaseConfig = {
  apiKey: "AIzaSyDb2hsI0Y3rNcBzxoqkbH6ws0SRH1Gu1Aw",
  authDomain: "auctionappnotifications.firebaseapp.com",
  projectId: "auctionappnotifications",
  storageBucket: "auctionappnotifications.appspot.com",
  messagingSenderId: "101636570166",
  appId: "1:101636570166:web:9b48cf59ebeb7d79e32c97",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/firebase-logo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log(event);
  return event;
});
