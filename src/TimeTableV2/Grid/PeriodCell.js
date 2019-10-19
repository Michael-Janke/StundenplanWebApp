import React from 'react';
import { Typography } from '@material-ui/core';
import ThemedGridCell from './ThemedGridCell';
import { makeStyles } from '@material-ui/styles';
import GridCell from './GridCell';

const useStyles = makeStyles(theme => ({
    times: {
        display: 'none',
        flexDirection: 'column',
        padding: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center'
    },
    timeTypography: {
        fontSize: theme.typography.pxToRem(9),
    },
    periodNumber: {
        margin: 'auto',
        fontSize: theme.typography.pxToRem(15),
    },


}), { name: "PeriodCell" });

function periodTime(timeAsNumber) {
    const lpad2 = number => (number < 10 ? '0' : '') + number;
    return Math.floor(timeAsNumber / 100) + ':' + lpad2(timeAsNumber % 100);
}

export default function PeriodCell({ period, ...other }) {
    const classes = useStyles();
    return (
        <GridCell {...other} className={classes.root}>
            <div className={classes.times}>
                <Typography variant="caption" className={classes.timeTypography}>
                    {periodTime(period.START_TIME)}
                </Typography>
                <Typography variant="caption" className={classes.timeTypography}>
                    {periodTime(period.END_TIME)}
                </Typography>
            </div>
            <Typography variant="subtitle2" className={classes.periodNumber}>
                {period.PERIOD_TIME_ID - 1}.
            </Typography>
        </GridCell>
    )
}