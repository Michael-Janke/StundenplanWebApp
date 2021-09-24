import { requestApiGenerator, API_URL } from './generator';

const ReportService = (store) => (next) => (action) => {
    next(action);
    switch (action.type) {
        case 'GET_REPORT': {
            return requestApiGenerator(next)(API_URL, 'report/' + action.id, { type: 'GET_REPORT', id: action.id });
        }
        case 'COMMIT_REPORT': {
            return requestApiGenerator(next)(
                API_URL,
                'report/commit',
                { type: 'COMMIT_REPORT' },
                'POST',
                JSON.stringify(action.payload)
            );
        }
        default:
    }
};

export default ReportService;
