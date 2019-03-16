import { getTimetableCacheKey, getSubstitutionsCacheKey } from './const';

const cacheService = store => next => action => {
    let state = store.getState();
    if (state.timetable.counterChanged) {
        return next(action);
    }
    switch (action.type) {
        case 'GET_TIMETABLE': {
            if (!state.timetable.timetables[getTimetableCacheKey(action.payload)]) {
                next(action);
            }
            break;
        }
        case 'GET_SUBSTITUTIONS': {
            if (!state.timetable.substitutions[getSubstitutionsCacheKey(action.payload)]) {
                next(action);
            }
            break;
        }
        default:
            next(action);
    }
};

export default cacheService;
