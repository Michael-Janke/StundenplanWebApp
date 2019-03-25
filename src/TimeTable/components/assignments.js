import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentDraftIcon from '@material-ui/icons/AssignmentOutlined';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AssignmentLink from './assignmentLink';

export default function Assignments(props) {
    return (
        <React.Fragment>
            {props.assignments.map(assignment => {
                const turnedIn =
                    assignment.submissions &&
                    assignment.submissions.some(submission => submission.status === 'submitted');
                const draft = assignment.status === 'draft';
                const reg = /(?:<p>)(.*?)(?:<\/p>)/gi;
                let match;
                const content = [];
                while (!!(match = reg.exec(assignment.instructions ? assignment.instructions.content : ''))) {
                    content.push(match[1]);
                }
                return (
                    <AssignmentLink
                        key={assignment.id}
                        id={assignment.classId}
                        icon={
                            draft ? <AssignmentDraftIcon /> : turnedIn ? <AssignmentTurnedInIcon /> : <AssignmentIcon />
                        }
                        assignment={assignment}
                    >
                        <ListItemText
                            primary={(draft ? 'Entwurf: ' : '') + assignment.displayName}
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
