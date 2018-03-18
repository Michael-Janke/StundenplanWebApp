 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/4.11.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/4.11.0/firebase-messaging.js');
 // Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
 firebase.initializeApp({
   'messagingSenderId': '1089330166521'
 });
 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]

 messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = payload.data.title || 'Wolkenberg Stundenplan';
  var notificationOptions = {
      body: payload.data.body || '',
      icon:  payload.data.icon || 'https://wolkenberg-gymnasium.de/wolkenberg-app/stundenplan-web-app/img/icons/icon-192x192.png',
      badge:  payload.data.badge || 'https://wolkenberg-gymnasium.de/wolkenberg-app/stundenplan-web-app/img/batch-icon.png',
      image:  payload.data.image,
      silent:  !!payload.data.silent,
  };

  let notification = self.registration.showNotification(notificationTitle, notificationOptions);
  return notification;
});

self.addEventListener('notificationclick', function(event) {
  let url = 'https://wolkenberg-gymnasium.de/wolkenberg-app/stundenplan-web-app/';
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
      clients.matchAll({type: 'window'}).then( windowClients => {
          // Check if there is already a window/tab open with the target URL
          for (var i = 0; i < windowClients.length; i++) {
              var client = windowClients[i];
              // If so, just focus it.
              if (client.url === url && 'focus' in client) {
                  return client.focus();
              }
          }
          // If not, then open the target URL in a new window/tab.
          if (clients.openWindow) {
              return clients.openWindow(url);
          }
      })
  );
});