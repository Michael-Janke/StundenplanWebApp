import request from 'superagent'

export const API_URL = 'https://www.wolkenberg-gymnasium.de/wolkenberg-app/api/';

const getApiGenerator = next => (route, name, token) => request
    .get(API_URL+route)
    .set('accept', 'json')
    .set('Authorization', 'Bearer: ' + token)
	.end((err, res) => {
		if (err) {
			return next({
				type: name+'_ERROR',
				err
			})
		}
		const data = JSON.parse(res.text)
		next({
			type: name+'_RECEIVED',
			data
		})
    })
    
const postApiGenerator = next => (route, name, data) => request
    .post(API_URL+route)
    .send(JSON.stringify(data))
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
	.end((err, res) => {
		if (err) {
			return next({
				type: name+'_ERROR',
				payload: (err.response && err.response.body) || err
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
    if(action.type === "GET_TOKEN") {
        return postApiGenerator(next)('token', 'GET_TOKEN', action.payload);
    }
    const token = store.getState().login.token;
    switch(action.type){
    case 'whatever':
        getApiGenerator(next)('token', 'GET_Whatever', token);
        break;
	default:
		break
	}
};

export default dataService