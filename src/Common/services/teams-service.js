
import { requestApiGenerator, GRAPH_URL } from './generator';


const teamsService = store => next => action => {
    next(action);
    switch (action.type) {
        case "GET_JOINED_TEAMS":
            return requestApiGenerator(next)(GRAPH_URL, 'beta/groups', { type: 'GET_JOINED_TEAMS' });
        default:
            break
    }
};

export default teamsService 