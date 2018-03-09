export function loadMe() {
    return {type: "GET_ME"};
}

export function loadProfilePicture() {
    return {type: "GET_PROFILE_PICTURE"};
}

export function clearErrors() {
    return {type: "CLEAR_ERROR", payload: null};
}
