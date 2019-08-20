import React from 'react';
import EditIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import WebsiteIcon from '@material-ui/icons/GridOn';
import WebsiteOffIcon from '@material-ui/icons/GridOff';
import FlashIcon from '@material-ui/icons/FlashOn';
import FlashOffIcon from '@material-ui/icons/FlashOff';
import IconButton from '@material-ui/core/IconButton';

export function EditButton({ onClick }) {
    return (
        <IconButton onClick={onClick}>
            <EditIcon />
        </IconButton>
    );
}
export function DeleteButton({ onClick }) {
    return (
        <IconButton onClick={onClick}>
            <DeleteIcon />
        </IconButton>
    );
}
export function HomepageButton({ toggled, onClick }) {
    return <IconButton onClick={onClick}>{toggled ? <WebsiteIcon /> : <WebsiteOffIcon />}</IconButton>;
}
export function HomepageBoxButton({ toggled, onClick }) {
    return <IconButton onClick={onClick}>{toggled ? <FlashIcon /> : <FlashOffIcon />}</IconButton>;
}
