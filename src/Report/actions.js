import moment from 'moment';

export function loadReport(id) {
    return {
        type: 'GET_REPORT',
        id,
    };
}

export function commitReport(date) {
    return {
        type: 'COMMIT_REPORT',
        payload: { date: moment(date).format('YYYY-MM-DD') },
    };
}
