const initialState = {
  type: null,
  id: null,
  upn: null,
  loading: false
};

export function userReducer(state = initialState, action = {}) {
  if (action.type.endsWith('_ERROR') || action.type === "persist/REHYDRATE") {
    return {
      ...state,
      loading: false
    };
  }

  switch (action.type) {
    case "GET_ME":
      return {
        ...state,
        loading: true
      };
    case "GET_ME_RECEIVED":
      return {
        ...state,
        loading: false,
        ...action.payload
      };
    case "PROFILE_PICTURE_RECEIVED":
      return {
        ...state,
        profilePicture: URL.createObjectURL(action.payload.blob)
      };
    case "PROFILE_PICTURE_SMALL_RECEIVED":
      return {
        ...state,
        profilePictureSmall: URL.createObjectURL(action.payload.blob)
      };
    default:
      return state;
  }
}

export function errorReducer(state = {
  error: null
}, action = {}) {
  if (action.type.endsWith("_ERROR")) {
    if (!action.payload) 
      return {error: null};
    var error = null;
    if (action.payload.crossDomain) {
      error = "Interner Serverfehler";
    } else if (action.payload.response) {
      error = action.payload.response.statusCode + ' | ' + action.payload.response.text;
    };
    return {error}
  } else {
    return state;
  }
}
