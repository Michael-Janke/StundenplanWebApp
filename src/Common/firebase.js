import firebase from 'firebase';

export function connectToServiceWorker(setNotification, oldToken) {
    const messaging = firebase.messaging();
    messaging.onTokenRefresh(function () {
        messaging.getToken()
            .then(function (refreshedToken) {
                console.log('Token refreshed.');
                setNotification({ oldToken, newToken: refreshedToken })
            })
            .catch(function (err) {
                console.log('Unable to retrieve refreshed token ', err);
                setNotification({ oldToken, newToken: null })
            });
    });
}