self.addEventListener('message', function handleSkipWaiting(event) {
    if (event.data === 'skipWaiting') { self.skipWaiting(); }
});