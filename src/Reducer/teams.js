const initialState = {
    unreadMessages: 0,
    joinedTeams: []
};

export default function teamsReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "GET_UNREAD_MESSAGES_RECEIVED":
            return {
                ...state,
                unreadMessages: action.payload && action.payload.unreadItemCount
            };
 
        default:
            return state;
    }
}