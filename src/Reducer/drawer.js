
const defaultState = {
    open: false,
};

function drawerReducer(state = defaultState, action) {
    switch (action.type) {
        case "OPEN_DRAWER":
            return { ...state, open: true };
        case "CLOSE_DRAWER":
            return { ...state, open: false };
        case "TOGGLE_DRAWER":
            return { ...state, open: !state.open };
        default: ;
    }
    return state;
}

export default drawerReducer;