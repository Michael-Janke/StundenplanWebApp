import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AssignmentLink from './assignmentLink';

function getAssignmentLink(assignment, link) {
    // from Assignment notification bot
    const reg = /team\/(\d+:.*%40thread\.skype)/;
    const match = reg.exec(link);

    const subEntityId = JSON.stringify({
        "version": "1.0",
        "config": {
            "classes": [
                {
                    "id": assignment.classId,
                    "assignmentIds": [
                        assignment.id
                    ]
                }
            ]
        },
        "action": "navigate",
        "view": "assignment-viewer",
    });


    return `${link.substring(0, match.index)}entity/66aeee93-507d-479a-a3ef-8f494af43945/classroom?context=${
        encodeURIComponent(JSON.stringify({
            subEntityId,
            "channelId": decodeURIComponent(match[1]),
        })
        )}`;
}

export default function Assignments(props) {
    return (
        <React.Fragment>
            <ListSubheader component="div">Hausaufgaben</ListSubheader>
            {props.assignments.map((assignment) => {
                const turnedIn = assignment.submissions &&
                    assignment.submissions.some(submission => submission.status === 'submitted');
                const reg = /(?:<p>)(.*?)(?:<\/p>)/ig;
                let match;
                const content = [];
                while (!!(match = reg.exec(assignment.instructions ? assignment.instructions.content : ""))) {
                    content.push(match[1]);
                }
                return (
                    <AssignmentLink
                        key={assignment.id}
                        id={props.team.id}
                        icon={turnedIn ? <AssignmentTurnedInIcon /> : <AssignmentIcon />}
                        getUrl={getAssignmentLink.bind(null, assignment)}>
                        <ListItemText
                            primary={assignment.displayName}
                            primaryTypographyProps={{ noWrap: true }}
                            secondaryTypographyProps={{ noWrap: true }}
                            secondary={content}
                        />
                    </AssignmentLink>
                );
            })}
        </React.Fragment>
    );
}