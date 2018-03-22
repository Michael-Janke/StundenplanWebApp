import { adalGetToken } from './Adal/react-adal';
import { authContext } from './Adal/adalConfig';
import moment from 'moment';

export const GRAPH_URL = 'https://graph.microsoft.com/';

const getBatchGenerator = next => (payload, name) => {
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
						[response.id]: { img: response.body, expires: moment().add(7, 'days')}
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

const getProfilePictures = (upns) => {
	return {
		requests: upns.map((upn) =>
			({
				"id": upn,
				"method": "GET",
				"url": `/users/${upn}/photos/48x48/$value`
			})
		)
	}
}

const dataService = store => next => action => {
	next(action);
	switch (action.type) {
		case 'GET_BATCH_AVATARS':
			return getBatchGenerator(next)(getProfilePictures(action.payload), 'BATCH_AVATARS');
		default:
			break
	}
};

export default dataService