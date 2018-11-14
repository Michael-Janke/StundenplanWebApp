import moment from 'moment';
import { getTimetableCacheKey, getSubstitutionsCacheKey } from '../Common/const';

const initialState = {
    loadingMasterData: false,
    masterdata: {
        Period_Time: [],
        Class: [],
        Teacher: [],
        Room: [],
        Student: [],
        minMaxDates: {},
    },
    timetables: {},
    substitutions: {},
    timetableDate: (moment().isoWeekday() >= 5) ? moment().add(1, 'week').startOf('week') : moment().startOf('week')
};

export default function timetableReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "persist/REHYDRATE":
            if (!action.payload || !action.payload.timetable) return { ...state }
            return {
                ...state,
                ...action.payload.timetable,
                currentTimeTableId: action.payload.user && action.payload.user.id,
                currentTimeTableType: action.payload.user && action.payload.user.type,
                loadingMasterData: false,
                timetableDate: state.timetableDate,
            };
        case "GET_MASTERDATA":
            return {
                ...state,
                loadingMasterData: true
            };
        case "GET_MASTERDATA_RECEIVED":
            return {
                ...state,
                loadingMasterData: false,
                masterdata: action.payload
            };
        case "GET_MASTERDATA_ERROR":
            return {
                ...state,
                loadingMasterData: false,
                error: action.payload
            };
        case "GET_ME_RECEIVED":
            return {
                ...state,
                currentTimeTableType: state.currentTimeTableType || action.payload.type,
                currentTimeTableId: state.currentTimeTableId || action.payload.id,
            };
        case "SET_TIMETABLE":
            return {
                ...state,
                currentTimeTableType: action.payload.type,
                currentTimeTableId: action.payload.id,
            };
        case "CHANGE_WEEK": case "SET_DATE": case "SET_MY_TIMETABLE":
            let { id, type } = action.payload;
            const min = moment.max(
                moment()
                    .year(state.masterdata.minMaxDates.min.year)
                    .week(state.masterdata.minMaxDates.min.week),
                moment().add(-1, 'week')
            );
            const max = moment()
                .year(state.masterdata.minMaxDates.max.year)
                .week(state.masterdata.minMaxDates.max.week);
            
            let newDate;
            if(action.payload.direction && action.payload.direction !== "now") {
                newDate = moment(state.timetableDate).add(action.payload.direction, 'week')
            } else if (action.payload.date) {
                newDate = moment(action.payload.date)
            } else {
                newDate = (moment().isoWeekday() >= 6) ? moment().add(1, 'week') : moment();
            }
            let timetableDate = moment.max(min,
                moment.min(max,
                    newDate
                )
            ).startOf('day');

            return {
                ...state,
                currentTimeTableId: id || state.currentTimeTableId,
                currentTimeTableType: type || state.currentTimeTableType,
                timetableDate,
                dateIsMin: timetableDate.isSame(min, 'week'),
                dateIsMax: timetableDate.isSame(max, 'week'),
            };
        case "GET_TIMETABLE":
            return state;
        case "GET_TIMETABLE_ERROR":
            return {
                ...state,
                timetables: { ...state.timetables, [getTimetableCacheKey(action.payload)]: null },
            };
        case "GET_TIMETABLE_RECEIVED":
            return {
                ...state,
                timetables: { ...state.timetables, [getTimetableCacheKey(action.request)]: action.payload },
                counterChanged: false,
            };
        case "GET_SUBSTITUTIONS":
            return {
                ...state,
                substitutions: {
                    ...state.substitutions,
                    // [getSubstitutionsCacheKey(action.payload)]: null
                },
            };
        case "GET_SUBSTITUTIONS_RECEIVED":
            return {
                ...state,
                substitutions: {
                    ...state.substitutions,
                    [getSubstitutionsCacheKey(action.request)]: action.payload
                },
                counterChanged: false
            }
        case "GET_SUBSTITUTIONS_ERROR":
            return {
                ...state,
                substitutions: {
                    ...state.substitutions,
                    [getSubstitutionsCacheKey(action.request)]: null
                },
            }
        case "COUNTER_CHANGED":
            // remove everything
            return {
                ...state,
                substitutions: {},
                timetables: {},
            };
        default:
            return state;
    }
}
