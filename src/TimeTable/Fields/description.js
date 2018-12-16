import React from 'react';

import { ObjectIcon } from '../../Main/components/Avatars';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

function Description({ classes, label, children, type, instead }) {
    return (
        <ListItem button={type!=="subject"}>
            <ListItemIcon>
                <ObjectIcon size={0} fontSize="inherit" type={type} />
            </ListItemIcon>
            <ListItemText primary={children} secondary={instead?"statt":undefined}/>
        </ListItem>
    )
}

export default Description;
