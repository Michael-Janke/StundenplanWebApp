import React from 'react';
import EditIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography, Paper } from '@material-ui/core';
import { classNames } from '../Common/const';

const styles = theme => ({
    HOLIDAY: {
        color: theme.palette.type === 'dark' ? green[200] : green[600],
        fontWeight: 'bold',
    },
    EXKURSION: {
        color: theme.palette.type === 'dark' ? orange[200] : orange[600],
    },
    NORMAL: {
        color: theme.palette.type === 'dark' ? grey[200] : grey[800]
    },
    EXAM: {
        color: theme.palette.type === 'dark' ? red[200] : red[800],
        fontWeight: 'bolder',
    },
    root: {
        display: 'flex',
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        backgroundColor: 'initial',
    },
    dateStrings: {
        display: 'flex',
        flexDirection: 'column',
        width: '25%',

    },
    dateFrom: {
        fontSize: '80%',
    },
    dateTo: {
        fontSize: '70%',
    },
    text: {
        marginLeft: 10,
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    primary: {
        fontSize: '70%',
    },
    secondary: {
        fontSize: '60%',
    }
});
function Date({ date, onEdit, onDelete, classes }) {
    if (!date) return null;
    let dateFrom = date.DATE_FROM && moment(date.DATE_FROM.date).format("DD.MM.");
    let dateTo = date.DATE_TO && moment(date.DATE_TO.date).format("DD.MM.");
    let timeFrom = date.DATE_FROM && moment(date.DATE_FROM.date).format("HH:mm");
    let timeTo = date.DATE_TO && moment(date.DATE_TO.date).format("HH:mm");
    return (
        <Paper elevation={0} className={classes.root}>
            <div className={classes.dateStrings}>
                <Typography variant="body1" className={classes.dateFrom}>
                    {dateFrom}
                </Typography>
                <Typography variant="body2" color="textSecondary" className={classes.dateTo}>
                    {dateFrom !== dateTo ? dateTo : ''}
                    {timeFrom !== '00:00' ? timeFrom : ''}
                    {timeFrom !== timeTo ? '-' + timeTo : ''}
                </Typography>
            </div>
            <div className={classes.text}>
                <Typography variant="body1" className={classNames(classes[date.TYPE], classes.primary)}>
                    {date.TEXT}
                </Typography>
                <Typography variant="body2" color="textSecondary" className={classes.secondary}>
                    {date.SUBTEXT}
                </Typography>
            </div>
            {onEdit && <IconButton onClick={onEdit}><EditIcon /></IconButton>}
            {onDelete && <IconButton onClick={onDelete}><DeleteIcon /></IconButton>}
        </Paper>
    )
}

export default withStyles(styles)(Date);
