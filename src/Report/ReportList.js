import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { SUBSTITUTION_MAP } from '../Common/const';
import { green, red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    kw: {
        backgroundColor: theme.palette.background.paper,
        fontWeight: 'bold',
    },
    dates: {
        color: theme.palette.text.secondary,
    },
    plus: {
        backgroundColor: red[50],
    },
    minus: {
        backgroundColor: green[50],
    },
}));

const numberFormat = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format;

function ReportList({ report, showNeutral }) {
    const classes = useStyles();
    const isAdmin = useSelector((state) => state.user.scope === 'admin');
    const maxWeek = moment().add(1, 'week').format('GGGG-WW');

    const weeks = report;
    const neutralWeeks = showNeutral
        ? () => true
        : (week) => Object.keys(weeks[week]).some((type) => weeks[week][type].some((row) => row.VALUE !== 0));

    let windowSum = 0;
    const valueClass = (v) => [classes.minus, null, classes.plus][v > 0 ? 2 : v < 0 ? 0 : -1];

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
                    .filter((week) => week <= maxWeek)
                    .filter(neutralWeeks)
                    .sort()
                    .map((week) => {
                        const sum = (weeks[week].RESERVE || []).reduce((sum, row) => sum + row.VALUE, 0);
                        const commited = (weeks[week].RESERVE || []).reduce((sum, row) => sum + row.COMMITED, 0);
                        windowSum += sum;
                        return (
                            <React.Fragment key={week}>
                                {weeks[week].RESERVE && (
                                    <TableRow>
                                        <TableCell component="th" scope="row" style={{ width: 50 }}>
                                            {moment(week, 'GGGG-WW').format('[KW] WW')}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            Reservestunden {isAdmin && commited > 0 && '•'}
                                        </TableCell>
                                        <TableCell align="right">{weeks[week].RESERVE.length} Schultage</TableCell>
                                        <TableCell align="right" className={valueClass(sum)}>
                                            {numberFormat(sum)}
                                        </TableCell>
                                        <TableCell align="right" className={valueClass(windowSum)}>
                                            {numberFormat(Math.ceil(windowSum))}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {weeks[week].CORRECTION &&
                                    weeks[week].CORRECTION.map((row) => {
                                        if (row.VALUE === 0 && !showNeutral) return null;
                                        windowSum += row.VALUE;
                                        return (
                                            <TableRow key={JSON.stringify(row)}>
                                                <TableCell component="th" scope="row">
                                                    {moment(row.DATE.date).format('DD.MM.')}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    Wertkorrektur {isAdmin && row.COMMITED > 0 && '•'}
                                                </TableCell>
                                                <TableCell align="right">{row.TEXT}</TableCell>
                                                <TableCell align="right" className={valueClass(row.VALUE)}>
                                                    {row.VALUE}
                                                </TableCell>
                                                <TableCell align="right" className={valueClass(windowSum)}>
                                                    {numberFormat(Math.ceil(windowSum))}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                {weeks[week].SUBSTITUTION &&
                                    weeks[week].SUBSTITUTION.map((row) => {
                                        if (row.VALUE === 0 && !showNeutral) return null;
                                        windowSum += row.VALUE;
                                        return (
                                            <TableRow key={JSON.stringify(row)}>
                                                <TableCell component="th" scope="row">
                                                    {moment(row.DATE.date).format('DD.MM.')}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {SUBSTITUTION_MAP[row.TYPE].name}{' '}
                                                    {isAdmin && row.COMMITED > 0 && '•'}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {moment(row.DATE.date).format('dd')}/{row.PERIOD - 1} {row.SUBJECTS}{' '}
                                                    {row.CLASSES} {row.TEXT}
                                                </TableCell>
                                                <TableCell align="right" className={valueClass(row.VALUE)}>
                                                    {row.VALUE}
                                                </TableCell>
                                                <TableCell align="right" className={valueClass(windowSum)}>
                                                    {numberFormat(Math.ceil(windowSum))}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                <TableRow className={classes.kw}>
                                    <TableCell className={classes.kw} colSpan={5}></TableCell>
                                </TableRow>
                            </React.Fragment>
                        );
                    })}
            </TableBody>
        </Table>
    );
}

export default ReportList;
