import React from 'react';
import PeriodCell from '../PeriodCell';
import { animated } from 'react-spring';
import ThemedGridCell from '../ThemedGridCell';

export default function TimetablePeriodCell({ row, GetHeightComponent, width, ...other }) {
    return (
        <GetHeightComponent row={row}>
            <animated.div style={{ width: width }}>
                <PeriodCell {...row} {...other}>
                </PeriodCell>
            </animated.div>
            <ThemedGridCell></ThemedGridCell>
        </GetHeightComponent>
    );
}