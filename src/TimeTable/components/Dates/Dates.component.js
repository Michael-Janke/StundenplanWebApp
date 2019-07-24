import React from 'react';
import grey from '@material-ui/core/colors/grey';
import { classNames, WEEKDAY_NAMES, DATE_COLORS } from '../../../Common/const';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import PeriodCell from '../periodCell';
import { withStyles, TableBody, Tooltip } from '@material-ui/core';
import CalendarIcon from '@material-ui/icons/Event';

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import indigo from '@material-ui/core/colors/indigo';

const moment = extendMoment(Moment);

const styles = theme => ({
    tableToolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        flex: '1 0 48px',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    tableHeader: {
        tableLayout: 'fixed',
        fontSize: '100%',
    },
    tableHeaderCell: {
        fontSize: '85%',
        textAlign: 'center',
        padding: 0,
    },
    tableHeaderRow: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
        height: 28,
    },
    today: {
        backgroundColor: grey[400],
    },
    offline: {
        width: 'unset',
        color: theme.palette.text.secondary,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: theme.spacing(2),
        borderRight: `1.5px solid ${theme.palette.divider}`,
        paddingRight: theme.spacing(2),
    },
    offlineText: {
        transition: theme.transitions.create(['max-width']),
        maxWidth: 100,
        textOverflow: 'clip',
        [theme.breakpoints.down('sm')]: {
            maxWidth: 0,
        },
    },
    offlineIcon: {
        transition: theme.transitions.create(['margin-right']),
        [theme.breakpoints.down('sm')]: {
            marginRight: 0,
        },
    },
    dates: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dateWrapper: {
        paddingTop: '0.25vmin',
        paddingRight: '0.25vmin',
        boxSizing: 'border-box',
    },
    date: {
        overflow: 'hidden',
        backgroundColor: indigo[50],
        display: 'flex',
        height: '100%',
    },
    dateText: {
        flex: 1,
        fontSize: '70%',
        overflow: 'hidden',
        wordBreak: 'break-word',
        padding: 2,
    },
    colorBar: {
        width: 3,
        marginRight: 5,
        backgroundColor: indigo[100],
    },
    iconWrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ...DATE_COLORS(theme),
});

const Dates = ({ dates, date, classes, small }) => {
    if (!dates || dates.length === 0) return null;
    return (
        <Table className={classes.tableHeader}>
            <TableHead>
                <TableRow className={classes.tableHeaderRow}>
                    <PeriodCell small={small}>
                        <div className={classes.iconWrapper}>
                            <CalendarIcon />
                        </div>
                    </PeriodCell>
                    {WEEKDAY_NAMES.map((day, i) => {
                        const mDate = date
                            .clone()
                            .startOf('day')
                            .weekday(0)
                            .add(i, 'days');
                        const isToday =
                            date &&
                            moment()
                                .startOf('day')
                                .diff(mDate, 'days') === 0;
                        return (
                            <TableCell
                                key={i}
                                className={classNames(classes.tableHeaderCell, isToday && classes.today)}
                                padding="none"
                            >
                                {date && mDate.format('DD.MM.')}
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <PeriodCell small={small} />
                    <td colSpan={5}>
                        <div className={classes.dates}>
                            {dates.map(date => (
                                <React.Fragment key={date.DATE_ID}>
                                    <div style={{ width: date.leftSpan * 20 + '%' }} />
                                    <div style={{ width: date.duration * 20 + '%' }} className={classes.dateWrapper}>
                                        <Tooltip title={date.SUBTEXT}>
                                            <div className={classes.date}>
                                                <div className={classes.colorBar} />
                                                <div className={classNames(classes[date.TYPE], classes.dateText)}>
                                                    {date.TEXT}
                                                </div>
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <div style={{ width: date.rightSpan * 20 + '%' }} />
                                </React.Fragment>
                            ))}
                        </div>
                    </td>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default withStyles(styles)(Dates);
