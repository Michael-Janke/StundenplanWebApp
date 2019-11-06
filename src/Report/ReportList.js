import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { SUBSTITUTION_MAP } from '../Common/const';

const useStyles = makeStyles(theme => ({
    kw: {
        backgroundColor: theme.palette.background.paper,
        fontWeight: 'boldz',
    },
    dates: {
        color: theme.palette.text.secondary,
    },
}));

const numberFormat = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format;

function ReportList({ report }) {
    const classes = useStyles();
    const maxDate = moment()
        .endOf('week')
        .add(1, 'week');
    const weeks = Object.keys(report).reduce((weeks, key) => {
        report[key].forEach(row => {
            let date = moment(row.DATE.date);
            if (maxDate < date) return;
            weeks[date.format('GGGG-WW')] = weeks[date.format('GGGG-WW')] || {};
            weeks[date.format('GGGG-WW')][key] = weeks[date.format('GGGG-WW')][key] || [];
            weeks[date.format('GGGG-WW')][key].push(row);
        }, {});
        return weeks;
    }, {});

    let windowSum = 0;

    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow className={classes.kw}>
                    <TableCell>Datum</TableCell>
                    <TableCell>Typ</TableCell>
                    <TableCell align="right">Informationen</TableCell>
                    <TableCell align="right">Wert</TableCell>
                    <TableCell align="right">Zähler</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.keys(weeks)
                    .sort()
                    .map(week => {
                        const sums = Object.keys(report).reduce((acc, key) => {
                            acc[key] = weeks[week][key] ? weeks[week][key].reduce((sum, row) => sum + row.VALUE, 0) : 0;
                            return acc;
                        }, {});
                        const sum = Object.values(sums).reduce((sum, row) => sum + row, 0);

                        return (
                            <>
                                {weeks[week].reserves && (windowSum += sums.reserves) && (
                                    <TableRow>
                                        <TableCell component="th" scope="row" style={{ width: 50 }}>
                                            {moment(week, 'GGGG-WW').format('[KW] WW')}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            Reservestunden
                                        </TableCell>
                                        <TableCell align="right">{weeks[week].reserves.length} Schultage</TableCell>
                                        <TableCell align="right">{numberFormat(sums.reserves)}</TableCell>
                                        <TableCell align="right">{numberFormat(Math.ceil(windowSum))}</TableCell>
                                    </TableRow>
                                )}
                                {weeks[week].substitutions &&
                                    weeks[week].substitutions.map(row => {
                                        windowSum += row.VALUE;
                                        return (
                                            <TableRow key={JSON.stringify(row)}>
                                                <TableCell component="th" scope="row">
                                                    {moment(row.DATE.date).format('DD.MM.')}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {SUBSTITUTION_MAP[row.TYPE].name}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {moment(row.DATE.date).format('dd')}/{row.PERIOD - 1} {row.SUBJECT}{' '}
                                                    {row.CLASSES} {row.TEXT}
                                                </TableCell>
                                                <TableCell align="right">{row.VALUE}</TableCell>
                                                <TableCell align="right">
                                                    {numberFormat(Math.ceil(windowSum))}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                <TableRow className={classes.kw}>
                                    <TableCell className={classes.kw} colSpan={2}>
                                        Zwischensumme {moment(week, 'GGGG-WW').format('[KW] WW')}
                                    </TableCell>
                                    <TableCell className={classes.dates} align="right">
                                        {moment(week, 'GGGG-WW').format('DD.MM.YY')} -{' '}
                                        {moment(week, 'GGGG-WW')
                                            .add(4, 'days')
                                            .format('DD.MM.YY')}
                                    </TableCell>
                                    <TableCell className={classes.kw} align="right">
                                        {numberFormat(sum)}
                                    </TableCell>
                                    <TableCell className={classes.kw} align="right">
                                        {numberFormat(Math.ceil(windowSum))}
                                    </TableCell>
                                </TableRow>
                            </>
                        );
                    })}
            </TableBody>
        </Table>
    );
}

export default ReportList;
