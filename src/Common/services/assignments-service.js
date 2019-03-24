import { requestApiGenerator, GRAPH_URL } from './generator';

const assignmentsService = store => next => action => {
    next(action);
    switch (action.type) {
        case 'CREATE_ASSIGNMENT':
            return requestApiGenerator(next)(
                GRAPH_URL,
                `beta/education/classes/${action.payload.teamId}/assignments`,
                {
                    type: 'CREATE_ASSIGNMENT',
                },
                'POST',
                JSON.stringify(action.payload.data)
            );
        case 'PUBLISH_ASSIGNMENT':
            return requestApiGenerator(next)(
                GRAPH_URL,
                `beta/education/classes/${action.payload.teamId}/assignments/${action.payload.id}/publish`,
                {
                    type: 'PUBLISH_ASSIGNMENT',
                },
                'POST'
            );
        default:
            break;
    }
};

export default assignmentsService;
