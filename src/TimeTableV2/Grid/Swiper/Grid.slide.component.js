import React from 'react';
import { useMeasureCallback } from './helpers';
import ThemedGridCellSwiper from './ThemedGridCell.swiper';

class LazyLoadGridSlideComponent extends React.Component {

    componentWillMount() {
        this.loader = {
            index: this.props.index,
            load: () => {
                this.setState({
                    rendered: (
                        <GridSlideComponent {...this.props}></GridSlideComponent>
                    )
                })
            }
        };
        this.props.performance.loaders.push(this.loader);
    }
    componentWillUnmount() {
        // this.props.performance.loaders.splice(
        //     this.props.performance.loaders.indexOf(this.loader),
        //     1);
    }

    state = {
        rendered: null,
    }

    render() {
        return this.state.rendered;
    }
}

function GridSlideComponent({ index, rows, slide, onRowHeight, renderComponent }) {
    return renderComponent(
        index,
        rows,
        rows.map((row, i) => <ReportingRowComponent
            row={row}
            slide={slide}
            key={i}
            index={i}
            onRowHeight={onRowHeight}></ReportingRowComponent>)
    ) || null;
}

export function ReportingRowComponent({ row = {}, slide, onRowHeight, index }) {
    const [{ ref }] = useMeasureCallback(({ height, width }) => {
        if (!slide[index]) {
            slide[index] = {};
        }
        slide[index].height = height;
        slide[index].width = width;
        onRowHeight(index);
        handleMinHeight();
    });
    const handleMinHeight = React.useCallback(() => {
        if (ref.current && ref.current.style) {
            ref.current.style.minHeight = `${row.backgroundHeight}px`;
        }
    }, [row.backgroundHeight, ref]);

    if (!row.listeners) {
        row.listeners = [];
    }
    row.listeners.push(handleMinHeight);

    return (
        <div style={{ minHeight: row.backgroundHeight }} ref={ref}></div>
    );
}

export default LazyLoadGridSlideComponent;