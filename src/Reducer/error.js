export default function errorReducer(state = { error: null }, action = {}) {
    if (action.type.endsWith("_ERROR")) {
        if (!action.payload)
            return { error: null };
        var error = null;
        if (action.payload.text) {
            error = action.payload.text;
        } else if (action.payload.crossDomain) {
            error = "Interner Serverfehler";
        } else if (action.payload.response) {
            error = action.payload.response.statusCode + ' | ' + action.payload.response.text;
        };
        return { error: action.type + ':' + error }
    } else {
        return state;
    }
}