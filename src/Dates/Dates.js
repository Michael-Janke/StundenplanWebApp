import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import grey from '@material-ui/core/colors/grey';
import CalendarIcon from '@material-ui/icons/Event';
import EditIcon from '@material-ui/icons/Create';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Fab from '@material-ui/core/Fab';
import classNames from 'classnames';
import { asynchronize } from '../Router/asynchronize';
import DatesList from './DatesList';
import DateDeletionDialog from './DateDeletionDialog';

import { useSelector, useDispatch } from 'react-redux';
import { deleteDate, editDate, addDate, setEditMode } from './actions';

const DateDialog = asynchronize(() => import('./DateDialog'), { hideSplash: false });

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
    },
    edit: {
        width: '90vw',
        maxWidth: 840,
    },
    header: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
    },
    fabButton: {
        position: 'absolute',
        right: theme.spacing(2),
        bottom: theme.spacing(2),
        zIndex: 2,
    },
    list: {
        position: 'relative',
        overflow: 'auto',
        flex: '1 0 0',
        paddingTop: 0,
        backgroundColor: theme.palette.background.default,
    },
    listSmall: {
        maxHeight: 'unset',
        overflow: 'initial',
    },
    buffer: {
        height: '75vh',
    },
}));

const Dates = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const editMode = useSelector(state => state.dates.editMode);
    const dates = useSelector(state => state.dates.dates);
    const isAdmin = useSelector(state => state.user.scope === 'admin');
    const small = useSelector(state => state.browser.lessThan.medium);

    const [selectedDate, selectDate] = useState({});
    const [dialogIsOpen, openDialog] = useState(false);
    const [deleteDialogIsOpen, openDeleteDialog] = useState(false);

    const handleEdit = date => {
        openDialog(false);
        if (!date) return;
        dispatch(date.DATE_ID ? editDate(date) : addDate(date));
    };

    const onDelete = date => {
        openDeleteDialog(true);
        selectDate(date);
    };

    const onEdit = date => {
        openDialog(true);
        selectDate(date);
    };

    const onAdd = () => {
        openDialog(true);
        selectDate({});
    };

    const handleDelete = date => {
        dispatch(deleteDate(date));
        openDeleteDialog(false);
    };

    const toggleEditMode = () => {
        dispatch(setEditMode(!editMode));
    };

    return (
        <div className={classNames(classes.root, editMode && classes.edit)}>
            <ListItem ContainerComponent="div" className={classes.header}>
                <ListItemIcon>
                    <CalendarIcon />
                </ListItemIcon>
                <ListItemText primary="Termine" />
                {isAdmin && (
                    <ListItemSecondaryAction>
                        <IconButton onClick={toggleEditMode}>
                            <EditIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
            <List className={classNames(classes.list, small && classes.listSmall)}>
                <DatesList onEdit={onEdit} onDelete={onDelete} />
                {!small && <div className={classes.buffer}>{!dates && 'Keine Termine eingetragen'}</div>}
            </List>
            {editMode && (
                <>
                    <Fab size="small" className={classes.fabButton} color="primary" onClick={onAdd}>
                        <AddIcon />
                    </Fab>
                    <DateDeletionDialog
                        open={deleteDialogIsOpen}
                        handleClose={() => openDeleteDialog(false)}
                        handleDelete={handleDelete}
                        date={selectedDate}
                    />

                    <DateDialog
                        open={dialogIsOpen}
                        handleClose={handleEdit}
                        date={selectedDate}
                        edit={selectDate.DATE_ID}
                    />
                </>
            )}
        </div>
    );
};

export default Dates;
