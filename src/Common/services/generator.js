import moment from 'moment';
import { getToken } from '../Authentication';

export const API_URL = 'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/';
export const GRAPH_URL = 'https://graph.microsoft.com/';

const handleErrors = (response) => {
    if (!response.ok) {
        throw response;
    }
    return response;
}
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
    });
    return handleErrors(response).json().catch(err => null);
}

export const requestApiGenerator = next => async (endpoint, route, action, METHOD = "GET", body) => {
    let token;
    let data;
    try {
        token = await getToken(endpoint);
        next({ type: 'ADAL_RECEIVED', payload: token });
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
        if (/offline/.test(err.message)) {
            next({
                ...action,
                type: 'ADAL_ERROR',
                payload: { text: "user is offline" }
            });
        } else {
            next({
                ...action,
                type: 'ADAL_ERROR',
                payload: { text: err.message || "unspecified error" }
            });
        }
        next({
            ...action,
            type: action.type + '_ERROR',
            payload: err.message ? { text: err.message } : err
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
                            expires: moment().add('7', 'days')
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