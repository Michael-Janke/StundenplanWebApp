import { adalGetToken } from './Adal/react-adal';
import { adalConfig, authContext } from './Adal/adalConfig';
import { createFeedbackMail } from './feedback';
export const API_URL = 'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/';
export const GRAPH_URL = 'https://graph.microsoft.com/';

const handleErrors = (response) => {
	if (!response.ok) {
		throw response;
	}
	return response;
}

const requestApiGenerator = next => (endpoint, route, action, METHOD = "GET", body) => {
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

const getImageGenerator = next => (endpoint, route, action) => {
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

const dataService = store => next => action => {
	next(action);
	switch (action.type) {
		case 'GET_ME':
			// GET_ME_RECEIVED will call this middleware again (store.dispatch)
			return requestApiGenerator(store.dispatch)(API_URL, 'me', { type: 'GET_ME' });
		case 'GET_MASTERDATA':
			return requestApiGenerator(next)(API_URL, 'all', { type: 'GET_MASTERDATA' });
		case 'ADD_DATE':
			return requestApiGenerator(next)(API_URL, 'dates/', { type: 'ADD_DATE' }, 'POST', JSON.stringify(action.payload));
		case 'DELETE_DATE':
			return requestApiGenerator(next)(API_URL, 'dates/' + action.payload.DATE_ID,
				{ type: 'DELETE_DATE', request: action.payload }, 'DELETE');
		case 'EDIT_DATE':
			return requestApiGenerator(next)(API_URL, 'dates/' + action.payload.DATE_ID, { type: 'EDIT_DATE' }, 'PATCH', JSON.stringify(action.payload));
		case 'GET_DATES':
			return requestApiGenerator(next)(API_URL, 'dates/', { type: 'GET_DATES' });
		case "GET_TIMETABLE": {
			return requestApiGenerator(next)(API_URL,
				`timetable/${action.payload.type}/${action.payload.id}`,
				{ type: 'GET_TIMETABLE', request: action.payload }
			);
		}
		case "GET_SUBSTITUTIONS": {
			let { id, type, week, year } = action.payload;
			return requestApiGenerator(next)(API_URL,
				`substitution/${type}/${id}/${year}-${week}`,
				{ type: 'GET_SUBSTITUTIONS', request: action.payload }
			);
		}
		case "SEND_LOGIN_STATISTIC":
			return requestApiGenerator(next)(API_URL, 'statistics/login', { type: "LOGIN_STATISTIC" }, 'POST', '{}');	
		case "SEND_FEEDBACK":
			return requestApiGenerator(next)(GRAPH_URL, 'beta/me/sendMail', { type: 'FEEDBACK' }, 'POST',
				JSON.stringify(createFeedbackMail(action.payload)));
		case "PATCH_REMIND_SETTINGS":
			return requestApiGenerator(next)(API_URL, 'me', { type: 'GET_ME' }, 'PATCH', JSON.stringify(action.payload));
		case "ADD_FAVORITE": case "REMOVE_FAVORITE":
			return requestApiGenerator(next)(API_URL, 'me', { type: 'GET_ME' }, 'PATCH', JSON.stringify({favorites: store.getState().user.favorites}));
		case 'GET_COUNTER':
			return requestApiGenerator(next)(API_URL, 'counter', { type: 'COUNTER' });
		case 'SET_NOTIFICATION':
			return requestApiGenerator(next)(API_URL, 'notifications', { type: 'SET_NOTIFICATION' },
				'POST', JSON.stringify(action.payload));
		case 'GET_PROFILE_PICTURE':
			return getImageGenerator(next)(GRAPH_URL, 'beta/me/photo/$value', { type: 'PROFILE_PICTURE' });
		case 'GET_PROFILE_PICTURE_SMALL':
			return getImageGenerator(next)(GRAPH_URL, 'beta/me/photos/48x48/$value', { type: 'PROFILE_PICTURE_SMALL' });
		default:
			break
	}
};

export default dataService 