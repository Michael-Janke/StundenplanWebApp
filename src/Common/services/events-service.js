import { requestApiGenerator, API_URL } from './generator';

const eventService = (store) => (next) => (action) => {
    next(action);
    switch (action.type) {
        case 'GET_GLOBAL_EVENTS':
            return requestApiGenerator(store.dispatch)(API_URL, 'events/', { type: 'GET_GLOBAL_EVENTS' });
        default:
    }
};

export default eventService;
