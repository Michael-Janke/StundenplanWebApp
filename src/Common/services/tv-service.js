import { requestApiGenerator, API_URL } from './generator';

const tvService = (store) => (next) => (action) => {
    next(action);
    switch (action.type) {
        case 'GET_DAY_INFO': {
            return requestApiGenerator(next)(API_URL, 'dayinfo', { type: 'GET_DAY_INFO' });
        }
        case 'GET_TRANSPORT_INFO': {
            return requestApiGenerator(next)(API_URL, 'transportinfo', { type: 'GET_TRANSPORT_INFO' });
        }

        default:
    }
};

export default tvService;
