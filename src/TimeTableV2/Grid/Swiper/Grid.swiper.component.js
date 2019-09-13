import React, { useRef, useState } from 'react'
import { useSprings, animated, useSpring } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { useMeasureCallback } from './helpers';

import GridBackground from './Grid.background';
import GridSlideComponent from './Grid.slide.component';

function Gesture({ onGesture, children, ...other }) {
    const bind = useGesture(onGesture);
    return (
        <div {...bind()} {...other}>
            {children}
        </div>
    )
}

function Width({ onWidth, children, ...other }) {
    const [bindMeasure] = useMeasureCallback(onWidth);
    return (
        <div {...bindMeasure} {...other}>
            {children}
        </div>
    )
}

function Springs({ length, getProps, children, onSet }) {
    const [props, set] = useSprings(length, getProps);
    onSet(set);
    return children(props);
}

function Spring({ children, onSet, getProps }) {
    const [props, set] = useSpring(getProps);
    onSet(set);
    return children(props);
}

class GridSwiperComponent extends React.Component {

    tempIndex = 0;
    width = 0;
    slides = [];

    state = {
        index: 0
    };

    componentWillReceiveProps(nextProps) {
        // index changed
        console.log("swiping to index ", nextProps.index, this.state.index, this.tempIndex);

        this.tempIndex = nextProps.index;
        this.onRowHeight();

        this.setTranslate((i, controller) => {
            const x = -((this.tempIndex - this.state.index)) * this.width;
            console.log("x=", x)
            return { x }
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        
        return nextState.index !== this.state.index;
    }

    toZero() {
        this.setTranslate((i, controller) => {
            const value = -((this.tempIndex - this.state.index)) * this.width;
            controller.getValues().x.setValue(value);
            return {
                x: value,
            }
        })
    }

    handleWidth = ({ width: w }) => {
        if (this.width !== w) {
            console.log("width changed", this.width, w);
            this.width = w;
            this.toZero();
        }

    }

    handleGesture = ({ down, delta: [xDelta, yDelta], vxvy: [vx, vy], direction: [xDir, yDir], distance, cancel }) => {
        const { width, setPeriodsCell, slides, setTranslate } = this;
        const { index } = this.state;
        if (down && Math.abs(xDelta) < Math.abs(yDelta)) {
            cancel();
        } else
            if (down ? (Math.abs(vx) > Math.abs(xDelta)) : distance > width / 2) {
                cancel();
                this.props.onChangeIndex(this.tempIndex, this.tempIndex + (xDelta > 0 ? -1 : 1));
                return;
            }
        setTranslate(() => {
            const x = (down ? xDelta : 0) - ((this.tempIndex - index)) * width;
            return { x }
        })
        setPeriodsCell((i) => {
            const vIndex = this.tempIndex;
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
            const percent = (down ? Math.abs(xDelta) : 0) / width;
            return {
                height: period.height * (1 - percent) + newPeriod.height * percent,
            }
        })
    }

    onRowHeight = (index) => {
        const { setPeriodsCell, tempIndex, slides } = this;
        setPeriodsCell((i) => {
            if (index && index !== i) {
                return;
            }
            const vIndex = tempIndex;
            let slide = slides[vIndex];
            if (!slide) {
                return null;
            }
            let period = slide[i];
            if (!period.height) {
                return null;
            }
            return {
                height: period.height,
            }
        })
    }

    renderSlide(vIndex) {
        const { rows } = this.props;
        const { slides, onRowHeight } = this;
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
        );
    }

    handleCalcProps = (i, controller) => {
        return {
            x: 0,
            // https://www.react-spring.io/docs/hooks/api
            config: { mass: 1, tension: 200, friction: 20, clamp: true },
            onRest: () => {
                if (this.tempIndex !== this.state.index) {
                    console.log("updating slides due to new index", this.tempIndex, this.state.index)
                    this.setState({ index: this.tempIndex });
                    this.onRowHeight();
                    // reset value to 0
                    this.toZero();
                }
            }
        }
    }
    handleSetTranslate = (set) => {
        this.setTranslate = set;
    }

    handlePeriodsProps = (i) => {
        return ({
            height: 0,
        });
    };

    handleSetPeriodsCell = (set) => {
        this.setPeriodsCell = set;
    }


    render() {
        const { rows } = this.props;
        const { index } = this.state;
        const length = 3;
        const pivot = Math.floor(length / 2);

        return (
            <>
                <div
                    style={{ overflowY: 'overlay', maxHeight: 'calc(100vh - 180px)' }}
                >
                    <Width style={{
                        overflow: 'hidden',
                        position: 'relative',
                    }} onWidth={this.handleWidth}>
                        <Springs
                            length={rows.length}
                            getProps={this.handlePeriodsProps}
                            onSet={this.handleSetPeriodsCell}
                        >
                            {(periodsCellArray) => (
                                <GridBackground
                                    rows={rows}
                                    periodsCellArray={periodsCellArray}>
                                </GridBackground>
                            )}
                        </Springs>

                        <Gesture style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                        }} onGesture={this.handleGesture}>
                            <Spring
                                getProps={this.handleCalcProps}
                                onSet={this.handleSetTranslate}
                            >
                                {(props) => (
                                    <animated.div style={{
                                        willChange: 'transform',
                                        transform: props.x.interpolate(x => `translate3d(${x - pivot * this.width}px,0,0)`),
                                        display: 'flex',
                                        userSelect: 'none',
                                    }}>
                                        {new Array(length).fill(0, 0, length).map((_, i) => {
                                            const vIndex = (i - pivot) + index;
                                            return this.renderSlide(vIndex);
                                        })}
                                    </animated.div>
                                )}
                            </Spring>
                        </Gesture>
                    </Width>
                </div>
            </>
        );
    }
};

export default GridSwiperComponent;

