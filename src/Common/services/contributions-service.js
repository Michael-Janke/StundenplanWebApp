import { requestApiGenerator, API_URL } from "./generator";


export default store => next => action => {
    next(action);
    switch (action.type) {
        case "GET_CONTRIBUTIONS": {
            return requestApiGenerator(next)(API_URL, 'contributions/', { type: 'GET_CONTRIBUTIONS' });
        }
        case 'ADD_CONTRIBUTION':
            return requestApiGenerator(next)(API_URL, 'contributions/', { type: 'ADD_CONTRIBUTION' }, 'POST', JSON.stringify(action.payload));
        case 'DELETE_CONTRIBUTION':
            return requestApiGenerator(next)(API_URL, 'contributions/' + action.payload.CONTRIBUTION_ID,
                { type: 'DELETE_CONTRIBUTION', request: action.payload }, 'DELETE');
        case 'EDIT_CONTRIBUTION':
            {
                let data = action.payload;
                data.DATE_TO = data.DATE_TO.date;
                data.DATE_FROM = data.DATE_FROM.date;
                return requestApiGenerator(next)(API_URL, 'contributions/' + action.payload.CONTRIBUTION_ID, { type: 'EDIT_CONTRIBUTION' }, 'PATCH', JSON.stringify(action.payload));
            }
        default: ;
    }
}