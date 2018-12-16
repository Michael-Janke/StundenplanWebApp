import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Icon from '@material-ui/icons/Assignment';
import ListItemIcon from '@material-ui/core/ListItemIcon';

export default function Assignments(props) {
    return <React.Fragment>
                <ListSubheader component="div">Hausaufgaben</ListSubheader>
                {props.assignments.map((assignment) => 
                    <ListItem button key={assignment.id}>
                        <ListItemIcon>
                            <Icon />
                        </ListItemIcon>
                        <ListItemText primary={assignment.displayName} secondary={assignment.instructions && assignment.instructions.content} />
                    </ListItem>
                )}
            </React.Fragment>;
}