import { adalGetToken } from '../Adal/react-adal';
import { adalConfig, authContext } from '../Adal/adalConfig';
import moment from 'moment';

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
    let controller = new AbortController();
    let signal = controller.signal;
    timeout(10 * 1000).then(() => controller.abort());
    let response = await fetch(url, { ...options, signal });
    return handleErrors(response).json().catch(err => null);
}

export const requestApiGenerator = next => async (endpoint, route, action, METHOD = "GET", body) => {
    let token;
    let data;
    for (let i = 1; i <= 3; i++) {
        try {
            token = await adalGetToken(authContext, adalConfig.endpoints[endpoint]);
        } catch (err) {
            if (/offline/.test(err.message)) {
                next({
                    ...action,
                    type: 'OFFLINE_ERROR',
                    payload: { text: "offline" }
                });
            } else {
                next({
                    ...action,
                    type: 'TOKEN_ERROR',
                    payload: { text: err.message || "unspecified error" }
                });
            }
        }
        if (token) {
            try {
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
                next({
                    ...action,
                    type: action.type + '_ERROR',
                    payload: err.message ? { text: err.message } : err
                })
            }
        }
        await Promise.race([
            timeout(i * 1000 * 20),
            new Promise((resolve) => {
                const listener = () => {
                    resolve();
                    window.removeEventListener('online', listener)
                };
                window.addEventListener('online', listener);
            })
        ]);
    }
    next({
        ...action,
        type: action.type + '_TIMEOUT_ERROR',
        payload: { text: "fetch data timed out after 3 tries" },
    });
}

export const getImageGenerator = next => (endpoint, route, action) => {
    adalGetToken(authContext, adalConfig.endpoints[endpoint]).then((token) =>
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
    adalGetToken(authContext, GRAPH_URL).then((token) =>
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