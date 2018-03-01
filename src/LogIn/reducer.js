
const initialState = {
  loggedIn: false,
};

export function loginReducer(state = initialState, action = {}) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, loggedIn: action.payload.loggedIn };
    default:
      return state;
  }
}
