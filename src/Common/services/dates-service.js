import { requestApiGenerator, API_URL } from "./generator";


export default store => next => action => {
    next(action);
    switch (action.type) {
        case 'ADD_DATE':
            return requestApiGenerator(next)(API_URL, 'dates/', { type: 'ADD_DATE' }, 'POST', JSON.stringify(action.payload));
        case 'DELETE_DATE':
            return requestApiGenerator(next)(API_URL, 'dates/' + action.payload.DATE_ID,
                { type: 'DELETE_DATE', request: action.payload }, 'DELETE');
        case 'EDIT_DATE':
            return requestApiGenerator(next)(API_URL, 'dates/' + action.payload.DATE_ID, { type: 'EDIT_DATE' }, 'PATCH', JSON.stringify(action.payload));
        case 'GET_DATES': 
        case 'ADD_DATE_RECEIVED': 
        case 'DELETE_DATE_RECEIVED': 
        case 'EDIT_DATE_RECEIVED':
            return requestApiGenerator(next)(API_URL, 'dates/', { type: 'GET_DATES' });
        default: ;
    }
}