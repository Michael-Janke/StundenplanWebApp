import React from 'react';
import EditIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import WebsiteIcon from '@material-ui/icons/GridOn';
import WebsiteOffIcon from '@material-ui/icons/GridOff';
import FlashIcon from '@material-ui/icons/FlashOn';
import FlashOffIcon from '@material-ui/icons/FlashOff';
import IconButton from '@material-ui/core/IconButton';
import { editDate } from './actions';
import { useDispatch } from 'react-redux';

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
export function HomepageButton({ date }) {
    const dispatch = useDispatch();
    const toggleHomepage = () => {
        dispatch(
            editDate({
                DATE_ID: date.DATE_ID,
                HOMEPAGE: !date.HOMEPAGE + 0,
            })
        );
    };
    return <IconButton onClick={toggleHomepage}>{date.HOMEPAGE ? <WebsiteIcon /> : <WebsiteOffIcon />}</IconButton>;
}
export function HomepageBoxButton({ date }) {
    const dispatch = useDispatch();

    const toggleHomepageBox = () => {
        dispatch(
            editDate({
                DATE_ID: date.DATE_ID,
                HOMEPAGE_BOX: !date.HOMEPAGE_BOX + 0,
            })
        );
    };
    return <IconButton onClick={toggleHomepageBox}>{date.HOMEPAGE_BOX ? <FlashIcon /> : <FlashOffIcon />}</IconButton>;
}
