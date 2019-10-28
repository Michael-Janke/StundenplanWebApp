import React from 'react';
import { makeStyles, TableCell } from '@material-ui/core';
import classNames from 'classnames';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    tableHeaderCell: {
        fontSize: '100%',
        padding: 0,
    },
    tableHeaderCellPeriod: {
        padding: 2,
        width: 70,
    },
    tableHeaderCellPeriodSmall: {
        width: 20,
    },
    now: {
        backgroundColor: theme.palette.type === 'dark' ? grey[600] : grey[400],
    },
}));

const PeriodCell = ({ small, now, children }) => {
    const classes = useStyles();
    return (
        <TableCell
            padding="none"
            className={classNames(classes.tableHeaderCell, classes.tableHeaderCellPeriod, {
                [classes.tableHeaderCellPeriodSmall]: small,
                [classes.now]: now,
            })}
        >
            {children}
        </TableCell>
    );
};

export default PeriodCell;
