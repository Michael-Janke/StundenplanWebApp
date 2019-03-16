import React from 'react';

import { ObjectIcon } from '../../Main/components/Avatars';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

function Description({ upn, children, type, onClick }) {
    return (
        <ListItem button={!!onClick} onClick={onClick}>
            <ListItemIcon>
                <ObjectIcon size={24} fontSize={'default'} type={type} upn={upn} />
            </ListItemIcon>
            <ListItemText primary={children} />
        </ListItem>
    );
}

export default Description;
