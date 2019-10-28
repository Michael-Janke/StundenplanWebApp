import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/styles/makeStyles';
import classNames from 'classnames';
import { ButtonBase } from '@material-ui/core';
import { setTimeTable } from '../../../Main/actions';

const useStyles = makeStyles(theme => ({
    root: {
        padding: 4,
        flexGrow: 1,
        flexBasis: 0,
        margin: 2,
        textAlign: 'left',
        overflow: 'hidden',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontSize: '1em',
        fontFamily: theme.typography.fontFamily,
    },
}));

export default function StructureFragment({ children, className, room }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const rooms = useSelector(state => state.timetable.masterdata.Room);
    return (
        <ButtonBase
            className={classNames(classes.root, className)}
            onClick={() =>
                room && dispatch(setTimeTable('room', Object.values(rooms).find(r => r.NAME === room).ROOM_ID))
            }
        >
            {children}
        </ButtonBase>
    );
}
