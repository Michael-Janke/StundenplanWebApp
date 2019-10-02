import moment from 'moment';
import { getToken } from '../Authentication';
import { fetchData } from '../utils';

export const API_URL = 'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/';
export const GRAPH_URL = 'https://graph.microsoft.com/';

export const requestApiGenerator = next => async (endpoint, route, action, METHOD = 'GET', body) => {
    let token;
    let data;
    try {
        token = await getToken(endpoint);
        data = await fetchData(endpoint + route, {
            method: METHOD,
            body,
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'Application/Json',
            },
        });
        next({
            ...action,
            type: action.type + '_RECEIVED',
            payload: data,
        });
        return;
    } catch (err) {
        var error = err && (err.error || err);
        next({
            ...action,
            type: action.type + '_ERROR',
            payload: error.message ? { text: error.message } : error,
        });
    }
};

export const getImageGenerator = next => (endpoint, route, action) => {
    getToken(endpoint).then(token =>
        fetch(endpoint + route, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
            .then(res => res.blob())
            .then(blob =>
                next({
                    ...action,
                    type: action.type + '_RECEIVED',
                    payload: { blob },
                })
            )
            .catch(err =>
                next({
                    type: action.type + '_ERROR',
                    payload: err,
                })
            )
    );
};

export const getBatchGenerator = next => (payload, name) => {
    getToken(GRAPH_URL).then(token =>
        fetch(GRAPH_URL + 'v1.0/$batch', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'Application/Json',
            },
        })
            .then(res => res.json())
            .then(res =>
                next({
                    type: name + '_RECEIVED',
                    payload: res.responses.reduce(
                        (acc, response) => ({
                            ...acc,
                            [response.id]: {
                                img: response.body.error ? null : 'data:image/jpg;base64,' + response.body,
                                expires: +moment().add('7', 'days'),
                            },
                        }),
                        {}
                    ),
                })
            )
            .catch(err =>
                next({
                    type: name + '_ERROR',
                    payload: err,
                })
            )
    );
};
