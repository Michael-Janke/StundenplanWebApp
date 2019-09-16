import React from 'react';
import PeriodCell from '../PeriodCell';
import { animated } from 'react-spring';
import ThemedGridCell from '../ThemedGridCell';

export function TimetablePeriodCell({ row, GetHeightComponent, width }) {
    return (
        <GetHeightComponent row={row}>
            <animated.div style={{ width: width }}>
                <PeriodCell {...row}>
                </PeriodCell>
            </animated.div>
            <ThemedGridCell></ThemedGridCell>
        </GetHeightComponent>
    );
}