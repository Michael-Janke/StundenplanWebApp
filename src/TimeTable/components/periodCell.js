import React from 'react';
import { withStyles, TableCell } from '@material-ui/core';
import classNames from 'classnames';

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
};

const PeriodCell = ({ classes, small, children }) => (
    <TableCell
        padding="none"
        className={classNames(
            classes.tableHeaderCell,
            classes.tableHeaderCellPeriod,
            small && classes.tableHeaderCellPeriodSmall
        )}
    >
        {children}
    </TableCell>
);

export default withStyles(styles)(PeriodCell);
