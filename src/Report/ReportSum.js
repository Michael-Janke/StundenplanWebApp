import React, { useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link } from 'react-router-dom';
import { green, red } from '@material-ui/core/colors';
import { loadReport } from './actions';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: theme.palette.background.default,
    },
    header: {
        maxWidth: 800,
        margin: '0 auto',
        padding: `${theme.spacing(2)}px`,
        textAlign: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    layout: {
        maxWidth: 800,
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: theme.spacing(2),
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    table: {
        backgroundColor: theme.palette.background.paper,
    },
    plus: {
        backgroundColor: red[50],
    },
    minus: {
        backgroundColor: green[50],
    },
}));

function Report() {
    const classes = useStyles();

    const report = useSelector(state => state.report.all);

    const dispatch = useDispatch();

    const valueClass = v => [classes.minus, null, classes.plus][v > 0 ? 2 : v < 0 ? 0 : -1];

    const needLoad = report === undefined;
    useEffect(() => {
        needLoad && dispatch(loadReport('all'));
    }, [needLoad, dispatch]);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.row}>
                    <Typography variant="h6" align="center" color="textSecondary">
                        Berichtsübersicht
                    </Typography>
                </div>
            </div>
            <div className={classes.layout}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow className={classes.kw}>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Zähler Heute</TableCell>
                            <TableCell align="right">Zähler +1 Woche</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {((report && report.report) || []).map(row => (
                            <TableRow key={row.NAME + row.SUM}>
                                <TableCell>
                                    <Link
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                        to={'/report/' + row.TEACHER_ID}
                                    >
                                        {row.NAME}
                                    </Link>
                                </TableCell>
                                <TableCell align="right" className={valueClass(row.SUM)}>
                                    {row.SUM}
                                </TableCell>
                                <TableCell align="right" className={valueClass(row.SUM1)}>
                                    {row.SUM1}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default Report;
