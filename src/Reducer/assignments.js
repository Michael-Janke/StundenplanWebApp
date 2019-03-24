const initialState = {
    createAssignmentFor: null,
    createdAssignment: null,
    sending: false,
    created: false,
};

export default function assignmentsReducer(state = initialState, action = {}) {
    switch (action.type) {
        case 'OPEN_CREATE_ASSIGNMENT': {
            return {
                ...state,
                createdAssignment: null,
                sending: false,
                created: false,
                createAssignmentFor: action.payload.team,
                date: action.payload.date,
                error: null,
            };
        }
        case 'CLOSE_CREATE_ASSIGNMENT':
        case 'PUBLISH_ASSIGNMENT_RECEIVED': {
            return {
                ...state,
                createAssignmentFor: null,
                sending: false,
                created: false,
                createdAssignment: null,
            };
        }
        case 'CREATE_ASSIGNMENT': {
            return {
                ...state,
                created: false,
                sending: true,
            };
        }
        case 'PUBLISH_ASSIGNMENT': {
            return {
                ...state,
                sending: true,
            };
        }
        case 'CREATE_ASSIGNMENT_RECEIVED': {
            return {
                ...state,
                createdAssignment: action.payload,
                sending: false,
                created: true,
            };
        }
        case 'CREATE_ASSIGNMENT_ERROR': {
            return {
                ...state,
                sending: false,
                created: false,
                error: action.payload.text,
            };
        }
        case 'PUBLISH_ASSIGNMENT_ERROR': {
            return {
                ...state,
                sending: false,
                created: false,
                error: action.payload.text,
            };
        }
        default:
            return state;
    }
}
