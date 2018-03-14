const initialState = {
  loadingMasterData: false,
  masterdata: {
    Period_Time: [],
    Class: [],
    Teacher: [],
    Room: [],
    Student: [],
  }
};

export function timetableReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "persist/REHYDRATE":
      if(!action.payload || !action.payload.timetable) return {...state}
      return {
        ...state,
        ...action.payload.timetable,
        loadingMasterData: false
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
    default:
      return state;
  }
}
