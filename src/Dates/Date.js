import React from 'react';

import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography, Paper } from '@material-ui/core';
import Linkify from 'react-linkify';
import classNames from 'classnames';
import { DATE_COLORS } from '../Common/const';

const styles = theme => ({
    ...DATE_COLORS(theme),
    root: {
        display: 'flex',
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
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
    },
});
function Date({ date, buttons, classes }) {
    if (!date) return null;
    let dateFrom = date.DATE_FROM && moment(date.DATE_FROM.date).format('DD.MM.');
    let dateTo = date.DATE_TO && moment(date.DATE_TO.date).format('DD.MM.');
    let timeFrom = date.DATE_FROM && moment(date.DATE_FROM.date).format('HH:mm');
    let timeTo = date.DATE_TO && moment(date.DATE_TO.date).format('HH:mm');
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
                    <Linkify>{date.SUBTEXT}</Linkify>
                </Typography>
            </div>
            {buttons}
        </Paper>
    );
}

export default withStyles(styles)(Date);
