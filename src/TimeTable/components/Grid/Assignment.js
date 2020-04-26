import React, { useEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { indigo } from '@material-ui/core/colors';
import { darken } from '@material-ui/core/styles';
import { getAssignmentLink } from '../assignmentLink';
import { useSelector, useDispatch } from 'react-redux';
import { getTeamsWebUrl } from '../../../Main/actions';

const useStyle = makeStyles((theme) => ({
    assignment: {
        overflow: 'hidden',
        backgroundColor: darken(indigo[50], theme.palette.type === 'dark' ? 0.6 : 0),
        display: 'flex',
        flex: 1,
        height: 'auto',
    },
    text: {
        flex: 1,
        fontSize: '70%',
        overflow: 'hidden',
        wordBreak: 'break-word',
        padding: 2,
    },
    name: {
        fontWeight: 600,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    time: {
        fontSize: '80%',
    },
    subject: {
        fontSize: '80%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    colorBar: {
        width: 3,
        marginRight: 5,
        backgroundColor: indigo[100],
    },
}));

const translate = (status) =>
    ({
        submitted: 'abgegeben',
        draft: 'Entwurf',
        assigned: 'aufgegeben',
    }[status] || status);

const Assignment = ({ assignment }) => {
    const classes = useStyle();
    const teamUrl = useSelector(({ teams }) => teams.teamUrls && teams.teamUrls[assignment.team && assignment.team.id]);
    const dispatch = useDispatch();
    useEffect(() => {
        assignment.team && dispatch(getTeamsWebUrl(assignment.team.id));
    }, [assignment.team, dispatch]);

    return (
        <div
            className={classes.assignment}
            onClick={() => teamUrl && window.open(getAssignmentLink(assignment, teamUrl.web), '_blank')}
        >
            <div className={classes.colorBar} />
            <div className={classes.text}>
                <div className={classes.name}>{assignment.displayName}</div>
                <div className={classes.time}>{translate(assignment.status)}</div>
                <div className={classes.subject}>{assignment.team && assignment.team.displayName}</div>
            </div>
        </div>
    );
};

export default Assignment;
