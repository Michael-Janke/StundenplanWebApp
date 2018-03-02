const initialState = {
  loading: false,
  token: null,
  id: null,
  username: '',
  error: null
};

export function loginReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "persist/REHYDRATE":
      return {
        ...state,
        username: action.payload.login.username,
        id: action.payload.login.id,
        token: action.payload.login.token
      };
    case "GET_TOKEN":
      return {
        ...state,
        username: action.payload.email,
        loading: true
      };
    case "GET_TOKEN_RECEIVED":
      return {
        ...state,
        loading: false,
        token: action.payload.token,
        id: action.payload.id,
        error: null
      };
    case "GET_TOKEN_ERROR":
      return {
        ...state,
        loading: false,
        token: null,
        error: action.payload
      };
    default:
      return state;
  }
}
