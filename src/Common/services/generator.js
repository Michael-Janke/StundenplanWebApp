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

export const requestApiGenerator = next => (endpoint, route, action, METHOD = "GET", body) => {
    adalGetToken(authContext, adalConfig.endpoints[endpoint]).then((token) =>
        fetch(endpoint + route, {
            method: METHOD,
            body,
            headers: {
                "Authorization": 'Bearer ' + token,
                "Content-Type": "Application/Json"
            }
        })
            .then(handleErrors)
            .then(res => res.json().catch(err => null))
            .then((res) =>
                next({
                    ...action,
                    type: action.type + '_RECEIVED',
                    payload: res
                }))
            .catch((err) =>
                next({
                    ...action,
                    type: action.type + '_ERROR',
                    payload: err.message ? { text: err.message } : err
                })
            )
    )
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