import React from 'react';
import HeaderBackground from './TimetableHeaderBackground';
import TimetablePeriodCell from './TimetablePeriodCell';
import PeriodCell from '../PeriodCell';

export default function useRows(periods) {
    // structure of grid
    return React.useMemo(
        () => [
            {
                key: -1,
                swipeComponent: HeaderBackground,
                type: 'header',
            },
            ...Object.values(periods).map((period, i) => {
                return {
                    key: i,
                    period,
                    type: 'main',
                    swipeComponent: TimetablePeriodCell,
                    component: PeriodCell,
                };
            }),
            {
                key: -2,
                swipeComponent: HeaderBackground,
                type: 'footer',
            },
        ],
        [periods]
    );
}
