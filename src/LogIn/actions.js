
export function login(bool = true) {
  return {
      type: "LOGIN",
      payload: {
        loggedIn: bool
      }
    };
}
