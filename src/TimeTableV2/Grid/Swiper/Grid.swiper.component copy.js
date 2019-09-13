import React, { useRef, useState } from 'react'
import { useSprings, animated, useSpring } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { useMeasureCallback } from './helpers';

import GridBackground from './Grid.background';
import GridSlideComponent from './Grid.slide.component';

const GridSwiperComponent = React.memo(function({ rows }) {

    const length = 3;
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
    
    

    const [periodsCellArray, setPeriodsCell] = useSprings(rows.length, (i) => {
        return ({
            height: 0,
        });
    });


    const onRowHeight = React.useCallback((index) => {
        setPeriodsCell((i) => {
            if (index && index !== i) {
                return;
            }
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
            x.setValue(((tempIndex.current - index)) * width.current);
        }

        return {
            x: 0,
            onRest: () => {
                if (tempIndex.current !== index) {
                    setIndex(tempIndex.current);
                    onRowHeight();
                    // reset value to 0
                    x.setValue(0);
                }
            }
        }
    }, [index, onRowHeight]);
    const [props, set] = useSpring(calcProps);

    const bind = useGesture(({ down, delta: [xDelta, yDelta], vxvy: [vx, vy], direction: [xDir, yDir], distance, cancel }) => {
        if (down && Math.abs(xDelta) < Math.abs(yDelta)) {
            cancel();
        } else
            if (down ? (Math.abs(vx) > Math.abs(xDelta)) : distance > width.current / 2) {
                cancel();
                tempIndex.current = tempIndex.current + (xDelta > 0 ? -1 : 1);

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
        <div style={{ overflowY: 'overlay', maxHeight: 'calc(100vh - 180px)' }}>
            <div {...bindMeasure} style={{
                overflow: 'hidden',
                position: 'relative',
            }}>
                <GridBackground
                    rows={rows}
                    periodsCellArray={periodsCellArray}>
                </GridBackground>
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
                            let slide = slides[vIndex] || (slides[vIndex] = rows.map(row => ({})));
                            return (
                                <animated.div
                                    key={vIndex}
                                    style={{
                                        width: '100%',
                                        flexShrink: 0,
                                    }}>
                                    <GridSlideComponent
                                        onRowHeight={onRowHeight}
                                        index={vIndex}
                                        slide={slide}
                                        rows={rows}></GridSlideComponent>
                                </animated.div>
                            )
                        })}
                    </animated.div>
                </div>
            </div>
        </div>
    );
});

export default GridSwiperComponent;

