import React from 'react'
import { animated } from 'react-spring'
import { Width, Springs, Gesture, Spring } from './helpers';

import GridBackground from './Grid.background';
import GridSlideComponent from './Grid.slide.component';



class GridSwiperComponent extends React.Component {

    tempIndex = this.props.index;
    width = 0;

    areas = [];
    
    state = {
        index: this.props.index
    };

    componentWillReceiveProps(nextProps) {
        // index changed
        console.debug("swiping to index ", nextProps.index, this.state.index, this.tempIndex);

        this.tempIndex = nextProps.index;
        this.onRowHeight();

        this.setTranslate((i, controller) => {
            const x = -((this.tempIndex - this.state.index)) * this.width;
            return { x, immediate: false, }
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
            console.debug("width changed", this.width, w);
            this.width = w;
            this.toZero();
        }

    }

    handleGesture = ({ down, delta: [xDelta, yDelta], vxvy: [vx, vy], direction: [xDir, yDir], distance, cancel }) => {
        const { width, setTranslate } = this;
        const { index } = this.state;
        if (down && Math.abs(xDelta) < 5) {
            return;
        }

        if (down && Math.abs(xDelta) < Math.abs(yDelta)) {
            return;
        } else
            if (!down && Math.abs(xDelta) > width / 2) {
                cancel();
                this.props.onChangeIndex(this.tempIndex, this.tempIndex + (xDelta > 0 ? -1 : 1));
                return;
            }

        setTranslate(() => {
            const x = (down ? xDelta : 0) - ((this.tempIndex - index)) * width;
            return { x, immediate: down, config: { velocity: vx } }
        })

        Object.values(this.areas).forEach((value) => {
            value.setter((i) => {
                const vIndex = this.tempIndex;
                const newVIndex = vIndex + (down ? (xDelta > 0 ? -1 : 1) : 0);
                let slide = value.slides[vIndex];
                let newSlide = value.slides[newVIndex];
                if (!newSlide || !slide) {
                    return null;
                }
                let period = slide[i];
                let newPeriod = newSlide[i];
                const percent = (down ? Math.abs(xDelta) : 0) / width;
                const newHeight = (period ? period.height : 0) * (1 - percent) + (newPeriod ? newPeriod.height : 0) * percent;
                const newWidth = (period ? period.width : 0) * (1 - percent) + (newPeriod ? newPeriod.width : 0) * percent;
                return {
                    height: newHeight,
                    width: newWidth,
                }
            })
        })
    }

    onRowHeight = (index) => {
        const { tempIndex } = this;
        Object.values(this.areas).forEach((value) => {
            value.setter(((i) => {
                if (index && index !== i) {
                    return;
                }
                const vIndex = tempIndex;
                let slide = value.slides[vIndex];
                if (!slide) {
                    return null;
                }
                let period = slide[i];
                if (!period) {
                    return null;
                }
                return {
                    height: period.height,
                    width: period.width,
                }
            }))
        })
    }



    handleCalcProps = (i, controller) => {
        return {
            x: 0,
            // https://www.react-spring.io/docs/hooks/api
            config: {  mass: 1, tension: 120, friction: 14, clamp: true },
            onRest: () => {
                if (this.tempIndex !== this.state.index) {
                    console.debug("updating slides due to new index", this.tempIndex, this.state.index)
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
            width: 0,
        });
    };

    handleSetPeriodsCell = location => (set) => {
        this.areas[location].setter = set;
    }

    renderSlide(vIndex, area) {
        const { onRowHeight } = this;
        const areaObject = this.areas[area];
        let slide = areaObject.slides[vIndex] || (areaObject.slides[vIndex] = []);
        return (
            <div
                key={vIndex}
                style={{
                    width: '100%',
                    flexShrink: 0,
                }}>

                <GridSlideComponent
                    onRowHeight={onRowHeight}
                    renderComponent={areaObject.render}
                    index={vIndex}
                    slide={slide}
                    rows={areaObject.rows}></GridSlideComponent>
            </div>
        );
    }

    renderSwiper({ rows, render }, index, displayArray, pivot, translationValue) {
        if (!this.areas[index]) {
            this.areas[index] = {
                slides: [],
                setter: () => { },
                rows: rows,
                render: render,
            };
        }
        return (
            <div style={{
                overflow: 'hidden',
                position: 'relative',
            }}>
                <Springs
                    length={rows.length}
                    getProps={this.handlePeriodsProps}
                    onSet={this.handleSetPeriodsCell(index)}
                >
                    {(periodsCellArray) => (
                        <GridBackground
                            rows={rows}
                            periodsCellArray={periodsCellArray}>
                        </GridBackground>
                    )}
                </Springs>

                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                }}>
                    <animated.div style={{
                        willChange: 'transform',
                        transform: translationValue.x.interpolate(x => `translate3d(${x - pivot * this.width}px,0,0)`),
                        display: 'flex',
                        userSelect: 'none',
                    }}>
                        {displayArray.map(vIndex => {
                            return this.renderSlide(vIndex, index);
                        })}
                    </animated.div>
                </div>
            </div>
        )
    }

    renderChildren(displayArray, pivot, translationValue) {
        return React.Children.map(this.props.children, (child, index) => {
            const slide = React.Children.only(child.props.children);
            if (!slide.type === 'slide') {
                console.warn("type is not slide", slide.type);
                return null;
            }
            return React.cloneElement(
                child,
                null,
                this.renderSwiper(
                    slide.props,
                    index,
                    displayArray,
                    pivot,
                    translationValue
                )
            );
        })
    }


    render() {
        const { index } = this.state;
        const length = 3;
        const pivot = Math.floor(length / 2);
        const displayArray = new Array(length).fill(0, 0, length).map((_, i) => (i - pivot) + index);
        return (
            <Gesture onGesture={this.handleGesture}>
                <Width style={{ overflow: 'hidden' }} onWidth={this.handleWidth}>
                    <Spring
                        getProps={this.handleCalcProps}
                        onSet={this.handleSetTranslate}
                    >
                        {(translationValue) => (
                            <>
                                {this.renderChildren(displayArray, pivot, translationValue)}
                            </>
                        )}
                    </Spring>
                </Width>
            </Gesture>
        );
    }
};

export default GridSwiperComponent;

