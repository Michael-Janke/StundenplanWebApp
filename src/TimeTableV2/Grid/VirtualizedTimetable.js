import React from 'react';
import GridContainer from './Grid.container';
import SwipeableViews from 'react-swipeable-views';
import bindKeyboard from 'react-swipeable-views-utils/lib/bindKeyboard';
import Animated from 'animated/lib/targets/react-dom';
import virtualize from './virtualize';
import { Grid } from '@material-ui/core';

const VirtualizeSwipeableViews = bindKeyboard(virtualize(SwipeableViews));


export default function VirtualizedTimetable() {

    const [index, setIndex] = React.useState(0);
    const [position] = React.useState(() => new Animated.Value(0));

    const handleChangeIndex = React.useCallback((index) => {
        setIndex(index);
    }, []);

    const handleSwitch = React.useCallback((index, type) => {
        console.log("handleSwitch", index, type);
        if (type === 'end') {
            Animated.spring(position, { toValue: index }).start();
            return;
        }
        position.setValue(index);
    }, [position]);

    const slideRenderer = React.useCallback(({ index: newIndex, key, indexContainer }) => {
        console.log(indexContainer);
        const inputRange = [indexContainer - 1, indexContainer, indexContainer + 1];
        const scale = position.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7]
        });
        const opacity = position.interpolate({
            inputRange,
            outputRange: [0, 1, 0]
        });

        return (
            <Animated.div
                key={key}
                style={{
                    opacity,
                    // transform: [{ scale }],
                }}>
                <GridContainer></GridContainer>
            </Animated.div>
        )
    }, [position]);
    console.log(index);

    return (
        <div>
            <VirtualizeSwipeableViews
                enableMouseEvents
                overscanSlideAfter={2}
                overscanSlideBefore={1}
                index={index}
                onChangeIndex={handleChangeIndex}
                onSwitching={handleSwitch}
                slideRenderer={slideRenderer}
            />
        </div>
    )
}