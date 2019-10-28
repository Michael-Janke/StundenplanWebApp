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
            {
                key: -3,
                swipeComponent: 'div',
                type: 'absences',
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
                key: -4,
                swipeComponent: HeaderBackground,
                type: 'header',
                variant: 'small',
            },
            {
                key: -2,
                swipeComponent: 'div',
                type: 'footer',
            },
        ],
        [periods]
    );
}
