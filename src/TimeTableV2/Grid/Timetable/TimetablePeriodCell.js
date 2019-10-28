import React from 'react';
import PeriodCell from '../PeriodCell';
import { animated } from 'react-spring';

export default function TimetablePeriodCell({ row, GetHeightComponent, width, ...other }) {
    return (
        <animated.div style={{ width: width, display: 'flex', alignItems: 'center', height: '100%' }}>
            <GetHeightComponent row={row}>
                <PeriodCell {...row} {...other}></PeriodCell>
            </GetHeightComponent>
        </animated.div>
    );
}
