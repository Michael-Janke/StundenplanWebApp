export function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(new Error('timeout'));
        }, ms);
        promise.then(resolve, reject);
    });
}

export async function fetchData(url, options) {
    if (!navigator.onLine) {
        throw new Error('navigator offline');
    }
    if (window.AbortController) {
        var controller = new AbortController();
        var signal = controller.signal;
    }
    let response = await timeout(1000 * 6, fetch(url, { ...options, signal })).catch(error => {
        if (controller) {
            controller.abort();
        }
        throw error;
    });
    if (response && response.ok) {
        return await response.json();
    }
    throw await response.json();
}

export function sendMail(email) {
    window.open(`https://outlook.office.com/?path=/mail/action/compose&to=${email}`, '_blank');
}
