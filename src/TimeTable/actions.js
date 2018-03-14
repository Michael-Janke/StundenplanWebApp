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
  