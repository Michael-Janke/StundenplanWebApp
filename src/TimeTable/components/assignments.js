import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ListItemIcon from '@material-ui/core/ListItemIcon';

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
                    <ListItem button key={assignment.id}>
                        <ListItemIcon>
                            {turnedIn ? <AssignmentTurnedInIcon /> : <AssignmentIcon />}
                        </ListItemIcon>
                        <ListItemText
                            primary={assignment.displayName}
                            primaryTypographyProps={{ noWrap: true }}
                            secondaryTypographyProps={{ noWrap: true }}
                            secondary={content}
                        />
                    </ListItem>
                );
            })}
        </React.Fragment>
    );
}