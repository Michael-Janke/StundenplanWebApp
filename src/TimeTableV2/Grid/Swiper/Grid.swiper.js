import React, { useRef, useState } from 'react'
import { useSprings, animated, useSpring } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { useMeasure } from './helpers';
import GridContainer from '../Grid.container';

function Viewpager() {
    let tempIndex = useRef(0);
    let [index, setIndex] = useState(0)
    const [bindMeasure, { width }] = useMeasure();
    const length = 5;
    const pivot = Math.floor(length / 2);
    const calcProps = (i, controller) => ({
        from: {
            x: -(pivot) * width,
            sc: 1,
        },
        immediate: console.log,
        onRest: () => {
            console.log(controller);
            setIndex(tempIndex.current);
        }
    })
    const [props, set] = useSpring(calcProps);
    set(calcProps);

    const bind = useGesture(({ down, delta: [xDelta], direction: [xDir], distance, cancel }) => {
        if (down && distance > width / 2) {
            cancel();
            tempIndex.current = tempIndex.current + (xDir > 0 ? -1 : 1);
        }
        set(() => {
            const x = (down ? xDelta : 0) - ((tempIndex.current - index) + pivot) * width;
            const sc = down ? 1 - distance / width / 2 : 1
            return { x, sc }
        })
    })
    console.log(index);
    const { x, sc } = props;

    return (
        <div {...bindMeasure} {...bind()} style={{ overflow: 'hidden' }}>
            <animated.div style={{
                transform: x.interpolate(x => `translate3d(${x}px,0,0)`),
                display: 'flex',
            }}>
                {new Array(length).fill(0, 0, length).map((_, i) => {
                    const vIndex = (i - pivot) + index;
                    return (
                        <animated.div key={vIndex} style={{
                            transform: sc.interpolate(x => `scale(${x})`),
                            width: '100%',
                            flexShrink: 0,
                            overflow: 'hidden',
                        }}>
                            <GridContainer></GridContainer>
                        </animated.div>
                    );
                })}
            </animated.div>
        </div>);
}

export default Viewpager;

