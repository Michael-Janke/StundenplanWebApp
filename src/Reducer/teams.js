const initialState = {
    unreadMessages: 0,
    joinedTeams: [],
    assignments: [],
    webUrls: {}
};

export default function teamsReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "GET_UNREAD_MESSAGES_RECEIVED":
            return {
                ...state,
                unreadMessages: action.payload && action.payload.unreadItemCount
            };
        case "GET_JOINED_TEAMS_RECEIVED":
            return {
                ...state,
                joinedTeams: action.payload && action.payload.value
            };
        case "GET_ASSIGNMENTS_RECEIVED":
            return {
                ...state,
                assignments: action.payload && action.payload.value
            };
        case "GET_TEAMS_WEBURL_RECEIVED":
            return {
                ...state,
                webUrls: {
                    ...state.webUrls,
                    [action.id]: action.payload.webUrl
                }
            }
        default:
            return state;
    }
}