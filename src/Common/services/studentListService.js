import { requestApiGenerator, API_URL } from './generator';
import moment from 'moment';

export default (store) => (next) => (action) => {
    next(action);
    switch (action.type) {
        case 'GET_STUDENTLIST': {
            return requestApiGenerator(next)(
                API_URL,
                `studentlist/${action.timetableId}/${moment(action.date).format('YYYY-MM-DD')}`,
                action
            );
        }
        default:
    }
};
