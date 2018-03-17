export function setParams(params) {
    return {
        type: "SET_PARAMS",
        payload: params
      };
  }

  export function loadMasterData() {
    return {
        type: "GET_MASTERDATA"
      };
  }
  export function getTimetable(id, type) {
    return {
        type: "GET_TIMETABLE",
        payload: {
            id, type
        }
      };
  }
  