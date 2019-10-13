import React from 'react';
import { withStyles, TableCell } from '@material-ui/core';
import classNames from 'classnames';
import { grey } from '@material-ui/core/colors';

const styles = {
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
        backgroundColor: grey[400],
    },
};

const PeriodCell = ({ classes, small, now, children }) => (
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

export default withStyles(styles)(PeriodCell);
