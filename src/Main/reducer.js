import moment from 'moment';

const initialState = {
  type: null,
  id: null,
  upn: null,
  loading: false,
  counter: 0,
  counterChanged: true,
  lastUpdate: null,
  lastCheck: null,
  warning: true,
};

export function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "COUNTER_RECEIVED":
      return {
        ...state,
        counterChanged: state.counter !== action.payload.COUNTER,
        counter: action.payload.COUNTER,
        lastUpdate: moment(action.payload.LAST_CHANGE.date),
        lastCheck: moment(),
        warning: false
      };
      case "COUNTER_ERROR":
      return {
        ...state,
        warning: true
      };
    case "GET_ME":
      return {
        ...state,
        loading: true
      };
    case "GET_ME_ERROR":
      return {
        ...state,
        loading: false
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

export function errorReducer(state = { error: null }, action = {}) {
  if (action.type.endsWith("_ERROR")) {
    if (!action.payload)
      return { error: null };
    var error = null;
    if (action.payload.crossDomain) {
      error = "Interner Serverfehler";
    } else if (action.payload.response) {
      error = action.payload.response.statusCode + ' | ' + action.payload.response.text;
    };
    return { error }
  } else {
    return state;
  }
}

export function avatarReducer(state = { loading: false }, action = {}) {
  switch (action.type) {
    case "persist/REHYDRATE":
     return {
       ...state,
       ...action.payload.avatars,
       loading: false
     }
    case "GET_BATCH_AVATARS":
      return {
        ...state,
        loading: true
      };
    case "BATCH_AVATARS_RECEIVED":
      return {
        ...state,
        loading: false,
        ...action.payload
      };
    case "BATCH_AVATARS_ERROR":
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
