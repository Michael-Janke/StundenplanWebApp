import { requestApiGenerator, API_URL } from './generator';

const StudentListService = (store) => (next) => (action) => {
    next(action);
    switch (action.type) {
        case 'GET_STUDENTLIST': {
            return requestApiGenerator(next)(API_URL, `studentlist/${action.timetableId}`, action);
        }
        default:
    }
};

export default StudentListService;
