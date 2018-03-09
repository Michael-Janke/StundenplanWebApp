import request from 'superagent';
import {adalGetToken} from 'react-adal';
import {adalConfig, authContext} from '../adalConfig';

export const API_URL = 'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api-2/';
export const OUTLOOK_URL = 'https://outlook.office.com/';

const getApiGenerator = next => (endpoint, route, name) => {
	adalGetToken(authContext, adalConfig.endpoints[endpoint]).then((token) =>
		request
		.get(endpoint+route)
		.set('accept', 'Application/Json')
		.set('Authorization', 'Bearer ' + token)
		.then((res) => 
			next({
				type: name+'_RECEIVED',
				payload: JSON.parse(res.text)
			})
		)
		.catch((err) =>
			next({
				type: name+'_ERROR',
				payload: err
			})
		)
	)
}

const getImageGenerator = next => (endpoint, route, name) => {
	adalGetToken(authContext, adalConfig.endpoints[endpoint]).then((token) =>
		fetch(endpoint+route, {
			headers: {
			"Authorization": 'Bearer ' + token
			}
		})
		.then(res => res.blob())
		.then((blob) => 
			next({
				type: name+'_RECEIVED',
				payload: {profilePicture: URL.createObjectURL(blob)}
			})
		)
		.catch((err) =>
			next({
				type: name+'_ERROR',
				payload: err
			})
		)
	)
}
    
const postApiGenerator = next => (route, name, data) => request
    .post(API_URL+route)
    .send(JSON.stringify(data))
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
	.end((err, res) => {
		if (err) {
			return next({
				type: name+'_ERROR',
				payload: err
			})
		}
		const data = JSON.parse(res.text)
		next({
			type: name+'_RECEIVED',
			payload: data
		})
	})

const dataService = store => next => action => {   
	next(action);
    switch(action.type){
	case 'GET_ME':
        return getApiGenerator(next)(API_URL, 'me', 'GET_ME');
    case 'GET_MASTERDATA':
        return getApiGenerator(next)(API_URL, 'all', 'GET_MASTERDATA');
    case 'REFRESH_MASTERDATA':
		return getApiGenerator(next)(API_URL, 'version', 'REFRESH_MASTERDATA');
	case 'GET_PROFILE_PICTURE':
		return getImageGenerator(next)(OUTLOOK_URL, 'api/v2.0/me/photo/$value', 'PROFILE_PICTURE');
	default:
		break
	}
};

export default dataService