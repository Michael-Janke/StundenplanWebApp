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
  },
  timetables: {},
  substitutions: {},
  timetableDate: moment()
};

export default function timetableReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "persist/REHYDRATE":
      if (!action.payload || !action.payload.timetable) return { ...state }
      return {
        ...state,
        ...action.payload.timetable,
        loadingMasterData: false,
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
        currentTimeTableType: action.payload.type,
        currentTimeTableId: action.payload.id,
      };
    case "SET_TIMETABLE":
      return {
        ...state,
        currentTimeTableType: action.payload.type,
        currentTimeTableId: action.payload.id,
      };
    case "CHANGE_WEEK":
      const min = moment()
        .year(state.masterdata.minMaxDates.min.year)
        .week(state.masterdata.minMaxDates.min.week)
        .add(-1, 'week');
      const max = moment()
        .year(state.masterdata.minMaxDates.max.year)
        .week(state.masterdata.minMaxDates.max.week)
        .add(1, 'week');
      return {
        ...state,
        timetableDate: moment.max(min,
          moment.min(max,
            moment(state.timetableDate).add(action.payload.direction, 'week')
          )
        )
      };
    case "SET_DATE":
      return {
        ...state,
        timetableDate: action.payload
      }
    case "GET_TIMETABLE":
      return {
        ...state,
        // timetables: { ...state.timetables, [getTimetableCacheKey(action.payload)]: null },
      };
    case "GET_TIMETABLE_ERROR":
      return {
        ...state,
        timetables: { ...state.timetables, [getTimetableCacheKey(action.payload)]: null },
      };
    case "GET_TIMETABLE_RECEIVED":
      return {
        ...state,
        timetables: { ...state.timetables, [getTimetableCacheKey(action.request)]: action.payload },
        invalidated: false,
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
        invalidated: false,
      }
    case "GET_SUBSTITUTIONS_ERROR":
      return {
        ...state,
        substitutions: {
          ...state.substitutions,
          [getSubstitutionsCacheKey(action.request)]: null
        },
      }
    case "INVALIDATE":
      return {
        ...state,
        invalidated: true,
      };
    default:
      return state;
  }
}
