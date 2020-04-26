import React from 'react';
import { useDispatch } from 'react-redux';
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    makeStyles,
} from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { sendMail } from '../../Common/utils';
import { addFavorite, removeFavorite } from '../actions';
import { ObjectIcon } from './Avatars';

const useStyles = makeStyles({
    secondary: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    listItem: {
        paddingRight: 48,
    },
});

const SearchItem = ({ onClick, selected, style, tv, object }) => {
    const { upn, type, text, secondary, favorite } = object;
    const dispatch = useDispatch();

    const toggleFavorite = () =>
        dispatch(object.favorite ? removeFavorite(object.upn || object.text) : addFavorite(object.upn || object.text));

    const classes = useStyles();

    return (
        <div style={style}>
            <ListItem dense button selected={selected} onClick={() => onClick(object)} style={{ height: style.height }}>
                <ListItemIcon>
                    <ObjectIcon type={type} upn={upn} outline={true} size={40} />
                </ListItemIcon>
                <ListItemText
                    primary={text}
                    secondary={secondary}
                    classes={{ secondary: classes.secondary, root: classes.listItem }}
                />
                {!tv && secondary && (
                    <ListItemSecondaryAction>
                        {upn && (
                            <IconButton onClick={() => sendMail(upn)}>
                                <MailIcon></MailIcon>
                            </IconButton>
                        )}
                        <IconButton onClick={toggleFavorite}>{favorite ? <StarIcon /> : <StarBorderIcon />}</IconButton>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
        </div>
    );
};
export default SearchItem;
