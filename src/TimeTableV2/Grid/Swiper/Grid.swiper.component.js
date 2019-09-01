import React, { useRef, useState } from 'react'
import { useSprings, animated, useSpring } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { useMeasure, useMeasureCallback } from './helpers';
import GridContainer from '../Grid.container';
import GridPeriods from './Grid.periods';
import ThemedGridCellSwiper from './ThemedGridCell.swiper';

function GridSwiperComponent({ periods }) {

    const length = 10;
    const pivot = Math.floor(length / 2);
    const slides = useRef([]).current;

    let width = useRef(0);
    let tempIndex = useRef(0);
    const [bindMeasure] = useMeasureCallback(({ width: w }) => {
        if (width.current !== w) {
            width.current = w;
            set(calcProps);
        }

    });
    let [index, setIndex] = useState(0);

    const [periodsCellArray, setPeriodsCell] = useSprings(Object.values(periods).length, (i) => {
        return ({
            height: 53,
        });
    });


    const onPeriodHeight = React.useCallback(() => {
        setPeriodsCell((i) => {
            const vIndex = tempIndex.current;
            let slide = slides[vIndex];
            let period = slide[i];
            if (!period.height) {
                return null;
            }
            return {
                height: period.height,
            }
        })
    }, [setPeriodsCell, slides]);
    const calcProps = React.useCallback((i, controller) => {
        const x = controller.getValues().x;
        if (x) {
            x.setValue(0);
        }

        return {
            x: 0,
            onRest: () => {
                if (tempIndex.current !== index) {
                    setIndex(tempIndex.current);
                    onPeriodHeight();
                    // reset value to 0
                    controller.getValues().x.setValue(0);
                }
            }
        }
    }, [index, onPeriodHeight]);
    const [props, set] = useSpring(calcProps);

    const bind = useGesture(({ down, delta: [xDelta, yDelta], direction: [xDir], distance, cancel }) => {
        if (Math.abs(xDelta) < Math.abs(yDelta)) {
            cancel();
        }
        if (down && distance > width.current / 2) {
            cancel();
            tempIndex.current = tempIndex.current + (xDir > 0 ? -1 : 1);
        }
        set(() => {
            const x = (down ? xDelta : 0) - ((tempIndex.current - index)) * width.current;
            return { x }
        })
        setPeriodsCell((i) => {
            const vIndex = tempIndex.current;
            const newVIndex = vIndex + (down ? (xDir > 0 ? -1 : 1) : 0);
            let slide = slides[vIndex];
            let newSlide = slides[newVIndex];
            if (!newSlide || !slide) {
                return null;
            }
            let period = slide[i];
            let newPeriod = newSlide[i];
            if (!period || !newPeriod) {
                return null;
            }
            const percent = (down ? Math.abs(xDelta) : 0) / width.current;
            return {
                height: period.height * (1 - percent) + newPeriod.height * percent,
            }
        })
    });


    return (
        <div {...bindMeasure} style={{
            overflow: 'hidden',
            position: 'relative',
        }}>
            <GridPeriods
                periods={periods}
                periodsCellArray={periodsCellArray}>

            </GridPeriods>
            <div {...bind()} style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
            }}>
                <animated.div style={{
                    willChange: 'transform',
                    transform: props.x.interpolate(x => `translate3d(${x - (pivot * width.current)}px,0,0)`),
                    display: 'flex',
                    userSelect: 'none',
                }}>
                    {new Array(length).fill(0, 0, length).map((_, i) => {
                        const vIndex = (i - pivot) + index;
                        let periodsArray = slides[vIndex] || (slides[vIndex] = Object.values(periods).map(period => ({
                            ...period,
                            onPeriodHeight,
                        })));
                        return (
                            <animated.div
                                key={vIndex}
                                style={{
                                    width: '100%',
                                    flexShrink: 0,
                                }}>
                                <Slide
                                    index={vIndex}
                                    periodsArray={periodsArray}></Slide>
                            </animated.div>
                        )
                    })}
                </animated.div>
            </div>
        </div>
    );
}

function Slide({ index, periodsArray }) {
    return (
        <GridContainer GridCellComponent={ThemedGridCellSwiper}>
            {periodsArray.map((period, i) => <Period period={period} key={i}></Period>)}
        </GridContainer>
    );
}

function Period({ period }) {
    const [bind] = useMeasureCallback(({ height }) => {
        period.height = height;
        period.onPeriodHeight();
    });
    return (
        <div style={{ minHeight: 53, marginBottom: 1, }} {...bind}></div>
    );
}

export default GridSwiperComponent;

