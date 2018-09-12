const initialState = {
    favorites: []
};

export default function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "ADD_FAVORITE":
            return {
                ...state,
                favorites: [...state.favorites, action.payload]
            };
        case "REMOVE_FAVORITE":
            return {
                ...state,
                favorites: [...state.favorites.filter((fav) => fav !== action.payload)]
            };
        default:
            return state;
    }
}