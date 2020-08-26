import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { DatePicker } from '@material-ui/pickers';
import { commitReport } from './actions';
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        '&> *': {
            margin: theme.spacing(1),
        },
    },
}));

const Commit = () => {
    const isAdmin = useSelector((state) => state.user.scope === 'admin');
    const commit = useSelector((state) => state.report.commit);
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const classes = useStyles();
    const dispatch = useDispatch();

    const onCommit = () => dispatch(commitReport(selectedDate));

    if (!isAdmin) return null;

    if (!open) {
        return (
            <div>
                <IconButton onClick={() => setOpen(true)}>
                    <SettingsIcon />
                </IconButton>
            </div>
        );
    }

    if (commit && commit.ROWS !== undefined) {
        return (
            <div>
                Fixierte Einträge: {commit.ROWS}
                <br />
                bis zum Datum: {moment(commit.DATE.date).format('DD.MM.YYYY')}
            </div>
        );
    }

    if (commit && commit.error) {
        return <div>Fehler beim Commiten: {JSON.stringify(commit.error)}</div>;
    }

    return (
        <div className={classes.root}>
            <DatePicker
                disableToolbar
                variant="inline"
                format="DD.MM.YYYY"
                margin="normal"
                value={selectedDate}
                onChange={setSelectedDate}
                renderInput={(props) => <TextField {...props} helperText="" />}
            />

            <Button variant="contained" color="primary" onClick={onCommit} disabled={commit && commit.loading}>
                Commit
            </Button>
        </div>
    );
};

export default Commit;
