import { requestApiGenerator, API_URL } from './generator';

export default store => next => action => {
    next(action);
    switch (action.type) {
        case 'ADD_DATE':
            return requestApiGenerator(store.dispatch)(
                API_URL,
                'dates/',
                { type: 'ADD_DATE' },
                'POST',
                JSON.stringify(action.payload)
            );
        case 'DELETE_DATE':
            return requestApiGenerator(store.dispatch)(
                API_URL,
                'dates/' + action.payload.DATE_ID,
                { type: 'DELETE_DATE', request: action.payload },
                'DELETE'
            );
        case 'EDIT_DATE':
            return requestApiGenerator(store.dispatch)(
                API_URL,
                'dates/' + action.payload.DATE_ID,
                { type: 'EDIT_DATE' },
                'PATCH',
                JSON.stringify(action.payload)
            );
        case 'COUNTER_RECEIVED': {
            const dates = store.getState().dates;
            if (dates.loading || dates.currentHash === action.payload.DATES_HASH) return;
            store.dispatch({ type: 'GET_DATES' });
            break;
        }
        case 'GET_DATES':
        case 'ADD_DATE_RECEIVED':
        case 'DELETE_DATE_RECEIVED':
        case 'EDIT_DATE_RECEIVED':
            return requestApiGenerator(store.dispatch)(API_URL, 'dates/', { type: 'GET_DATES' });
        default:
    }
};
