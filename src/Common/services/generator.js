import moment from 'moment';
import { getToken } from '../Authentication';

export const API_URL = 'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/';
export const GRAPH_URL = 'https://graph.microsoft.com/';

const timeout = (timeout, success) =>
    new Promise((resolve, reject) =>
        setTimeout(resolve, timeout)
    );


async function fetchData(url, options) {
    if (window.AbortController) {
        var controller = new AbortController();
        var signal = controller.signal;
        timeout(10 * 1000).then(() => controller.abort());
    }
    let response = await fetch(url, { ...options, signal }).catch((err) => {
        if (/abort/.test(err.message)) {
            throw new Error("fetch timed out");
        }
        throw err;
    });
    if (response && response.ok) {
        return await response.json();
    }
    throw await response.json();
}

export const requestApiGenerator = next => async (endpoint, route, action, METHOD = "GET", body) => {
    let token;
    let data;
    try {
        if (!navigator.onLine) {
            throw new Error("navigator offline");
        }
        token = await getToken(endpoint);
        data = await fetchData(endpoint + route, {
            method: METHOD,
            body,
            headers: {
                "Authorization": 'Bearer ' + token,
                "Content-Type": "Application/Json"
            }
        });
        next({
            ...action,
            type: action.type + '_RECEIVED',
            payload: data
        });
        return;
    } catch (err) {
        var error = err && (err.error || err);
        next({
            ...action,
            type: action.type + '_ERROR',
            payload: error.message ? { text: error.message } : error
        })
    }
}

export const getImageGenerator = next => (endpoint, route, action) => {
    getToken(endpoint).then((token) =>
        fetch(endpoint + route, {
            headers: {
                "Authorization": 'Bearer ' + token
            }
        })
            .then(res => res.blob())
            .then((blob) =>
                next({
                    ...action,
                    type: action.type + '_RECEIVED',
                    payload: { blob }
                })
            )
            .catch((err) =>
                next({
                    type: action.type + '_ERROR',
                    payload: err
                })
            )
    )
}

export const getBatchGenerator = next => (payload, name) => {
    getToken(GRAPH_URL).then((token) =>
        fetch(GRAPH_URL + 'v1.0/$batch', {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Authorization": 'Bearer ' + token,
                "Content-Type": "Application/Json"
            }
        })
            .then(res => res.json())
            .then((res) =>
                next({
                    type: name + '_RECEIVED',
                    payload: res.responses.reduce((acc, response) => ({
                        ...acc,
                        [response.id]: {
                            img: response.body.error ? null : response.body,
                            expires: +moment().add('7', 'days')
                        }
                    }), {})
                })
            )
            .catch((err) =>
                next({
                    type: name + '_ERROR',
                    payload: err
                })
            )
    )
}