import { requestApiGenerator, GRAPH_URL } from './generator';
import moment from 'moment';

const teamsService = (store) => (next) => (action) => {
    next(action);
    switch (action.type) {
        case 'GET_JOINED_TEAMS':
            return requestApiGenerator(next)(GRAPH_URL, 'beta/education/me/classes', { type: 'GET_JOINED_TEAMS' });
        case 'GET_UNREAD_MESSAGES':
            return requestApiGenerator(next)(GRAPH_URL, 'v1.0/me/mailFolders/inbox', { type: 'GET_UNREAD_MESSAGES' });
        case 'CREATE_ASSIGNMENT_RECEIVED':
        case 'PUBLISH_ASSIGNMENT_RECEIVED':
        case 'GET_ASSIGNMENTS': {
            let date = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
            return requestApiGenerator(next)(
                GRAPH_URL,
                `beta/education/me/assignments?${[
                    '$select=instructions,id,classid,duedatetime,displayname,status',
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
        case 'GET_EVENTS':
            let dateStart = moment().subtract(1, 'weeks').startOf('isoWeek');
            let dateEnd = dateStart.clone().add(6, 'months');
            return requestApiGenerator(next)(
                GRAPH_URL,
                `beta/me/calendarView?startDateTime=${dateStart.format(
                    'YYYY-MM-DD'
                )}T00:00:00Z&endDateTime=${dateEnd.format(
                    'YYYY-MM-DD'
                )}T00:00:00Z&$top=1000&$select=start, end, organizer, subject, onlineMeeting`,
                {
                    type: 'GET_EVENTS',
                }
            );
        default:
            break;
    }
};

export default teamsService;
