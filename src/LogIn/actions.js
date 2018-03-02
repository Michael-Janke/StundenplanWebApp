
export function login(username, password) {
  return {
      type: "GET_TOKEN",
      payload: {
        email: username,
        password
      }
    };
}
