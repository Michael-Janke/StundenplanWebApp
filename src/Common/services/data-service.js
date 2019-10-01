import { createFeedbackMail } from '../feedback';
import { requestApiGenerator, API_URL, GRAPH_URL, getImageGenerator } from './generator';

const dataService = store => next => action => {
    next(action);
    switch (action.type) {
        case 'GET_ME':
            // GET_ME_RECEIVED will call this middleware again (store.dispatch)
            return requestApiGenerator(store.dispatch)(API_URL, 'me', { type: 'GET_ME' });
        case 'GET_MASTERDATA':
            return requestApiGenerator(next)(API_URL, 'all', { type: 'GET_MASTERDATA' });

        case 'GET_TIMETABLE': {
            return requestApiGenerator(next)(API_URL, `timetable/${action.payload.type}/${action.payload.id}`, {
                type: 'GET_TIMETABLE',
                request: action.payload,
            });
        }
        case 'GET_SUBSTITUTIONS': {
            let { id, type } = action.payload;
            return requestApiGenerator(next)(API_URL, `substitution/${type}/${id}`, {
                type: 'GET_SUBSTITUTIONS',
                request: action.payload,
            });
        }
        case 'GET_SUPERVISIONS': {
            let { year, week } = action.payload;
            return requestApiGenerator(next)(API_URL, `supervision/${year - week}`, {
                type: 'GET_SUPERVISIONS',
                request: action.payload,
            });
        }
        case 'SEND_LOGIN_STATISTIC':
            return requestApiGenerator(next)(
                API_URL,
                'statistics/login',
                { type: 'LOGIN_STATISTIC' },
                'POST',
                JSON.stringify(action.payload)
            );
        case 'GET_LOGIN_STATISTICS': {
            let { week, year, action: statisticAction } = action.payload;
            return requestApiGenerator(next)(API_URL, `statistics/summarize/${statisticAction}/${year}-${week}`, {
                type: 'GET_LOGIN_STATISTICS',
                request: action.payload,
            });
        }
        case 'SEND_FEEDBACK':
            return requestApiGenerator(next)(
                GRAPH_URL,
                'beta/me/sendMail',
                { type: 'SEND_FEEDBACK' },
                'POST',
                JSON.stringify(createFeedbackMail(action.payload))
            );
        case 'PATCH_REMIND_SETTINGS':
            return requestApiGenerator(next)(
                API_URL,
                'me',
                { type: 'GET_ME' },
                'PATCH',
                JSON.stringify(action.payload)
            );
        case 'ADD_FAVORITE':
        case 'REMOVE_FAVORITE':
            return requestApiGenerator(next)(
                API_URL,
                'me',
                { type: 'GET_ME' },
                'PATCH',
                JSON.stringify({ favorites: store.getState().user.favorites })
            );
        case 'GET_COUNTER':
            return requestApiGenerator(next)(API_URL, 'counter', { type: 'COUNTER' });
        case 'SET_NOTIFICATION':
            return requestApiGenerator(next)(
                API_URL,
                'notifications',
                { type: 'SET_NOTIFICATION' },
                'POST',
                JSON.stringify(action.payload)
            );
        case 'GET_PROFILE_PICTURE':
            return getImageGenerator(next)(GRAPH_URL, 'beta/me/photo/$value', { type: 'PROFILE_PICTURE' });
        case 'GET_PROFILE_PICTURE_SMALL':
            return getImageGenerator(next)(GRAPH_URL, 'beta/me/photos/48x48/$value', { type: 'PROFILE_PICTURE_SMALL' });
        default:
            break;
    }
};

export default dataService;
