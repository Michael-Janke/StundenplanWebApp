/* eslint-disable no-restricted-globals */
self.addEventListener('message', function handleSkipWaiting(event) {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

workbox.core.skipWaiting();
