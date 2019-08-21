import React from 'react';
import { Typography } from '@material-ui/core';
import ThemedGridCell from './ThemedGridCell';


export default function PeriodCell({ period, ...other }) {
    return (
        <ThemedGridCell {...other}>
            <Typography>
                {period.PERIOD_TIME_ID - 1}.
            </Typography>
        </ThemedGridCell>
    )
}