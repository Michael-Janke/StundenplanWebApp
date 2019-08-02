import isEqual from 'react-fast-compare';

const initialState = {
    unreadMessages: 0,
    schoolyear: 0,
    joinedTeams: {},
    assignments: [],
    teamUrls: {},
    notebookUrls: {},
    createAssignmentFor: null,
};

export default function teamsReducer(state = initialState, action = {}) {
    switch (action.type) {
        case 'GET_UNREAD_MESSAGES_RECEIVED':
            return {
                ...state,
                unreadMessages: action.payload && action.payload.unreadItemCount,
            };

        case 'GET_ME_RECEIVED':
            return {
                ...state,
                schoolyear: action.payload && action.payload.schoolyear,
            };
        case 'GET_JOINED_TEAMS_RECEIVED': {
            return isEqual(state.assignments, action.payload.value) //only update on change
                ? state
                : {
                      ...state,
                      joinedTeams:
                          action.payload &&
                          action.payload.value.filter(
                              team => team.externalId && team.externalId.startsWith(state.schoolyear)
                          ),
                  };
        }
        case 'GET_ASSIGNMENTS_RECEIVED': {
            return isEqual(state.assignments, action.payload.value) //only update on change
                ? state
                : {
                      ...state,
                      assignments: action.payload && action.payload.value,
                  };
        }
        case 'GET_TEAMS_WEBURL_RECEIVED':
            return {
                ...state,
                teamUrls: {
                    ...state.teamUrls,
                    [action.id]: {
                        web: action.payload.webUrl,
                        client: action.payload.webUrl.replace('https://teams.microsoft.com/', 'msteams:'),
                    },
                },
            };
        case 'GET_TEAMS_NOTEBOOK_RECEIVED': {
            let notebook = action.payload.value.length ? action.payload.value[0] : action.payload.value;
            return {
                ...state,
                notebookUrls: {
                    ...state.notebookUrls,
                    [action.id]: {
                        web: notebook.links.oneNoteWebUrl.href,
                        client: notebook.links.oneNoteClientUrl.href,
                    },
                },
            };
        }

        default:
            return state;
    }
}
