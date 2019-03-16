import { requestApiGenerator, GRAPH_URL } from './generator';
import moment from 'moment';

const teamsService = store => next => action => {
    next(action);
    switch (action.type) {
        case 'GET_JOINED_TEAMS':
            return requestApiGenerator(next)(GRAPH_URL, 'beta/education/me/classes', { type: 'GET_JOINED_TEAMS' });
        case 'GET_UNREAD_MESSAGES':
            return requestApiGenerator(next)(GRAPH_URL, 'v1.0/me/mailFolders/inbox', { type: 'GET_UNREAD_MESSAGES' });
        case 'GET_ASSIGNMENTS': {
            let date = moment()
                .subtract(1, 'weeks')
                .startOf('isoWeek')
                .format('YYYY-MM-DD');
            return requestApiGenerator(next)(
                GRAPH_URL,
                `beta/education/me/assignments?${[
                    '$select=instructions,id,classid,duedatetime,displayname',
                    `$filter=duedatetime gt ${date}T00:00:00Z`,
                    '$expand=submissions($select=status)',
                    '$orderby=duedatetime',
                ].join('&')}`,
                { type: 'GET_ASSIGNMENTS' }
            );
        }
        case 'GET_TEAMS_WEBURL':
            return requestApiGenerator(next)(GRAPH_URL, `v1.0/teams/${action.id}?$select=webUrl`, {
                type: 'GET_TEAMS_WEBURL',
                id: action.id,
            });
        case 'GET_TEAMS_NOTEBOOK':
            return requestApiGenerator(next)(GRAPH_URL, `beta/groups/${action.id}/onenote/notebooks?$select=links`, {
                type: 'GET_TEAMS_NOTEBOOK',
                id: action.id,
            });

        default:
            break;
    }
};

export default teamsService;
