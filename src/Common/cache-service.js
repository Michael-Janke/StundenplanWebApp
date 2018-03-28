import { getTimetableCacheKey, getSubstitutionsCacheKey } from "./const";

const cacheService = store => next => action => {
    switch (action.type) {
        case "GET_TIMETABLE": {
            if (!store.getState().timetable.timetables[getTimetableCacheKey(action.payload)]) {
                next(action);
            }
            break;
        }
        case "GET_SUBSTITUTIONS": {
            if (!store.getState().timetable.substitutions[getSubstitutionsCacheKey(action.payload)]) {
                next(action);
            }
            break;
        }
        default:
            next(action);
    };
};

export default cacheService;