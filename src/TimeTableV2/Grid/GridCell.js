import React from 'react';

export default function GridCell({ children, colspan = 1, rowspan = 1, className, Component, style }) {
    var customStyle = React.useMemo(() => {
        if (colspan === 1 && rowspan === 1) {
            // performance: no custom styles needed;
            return style;
        }
        return {
            gridColumn: 'auto / span ' + colspan,
            gridRow: 'auto / span ' + rowspan,
            ...style,
        }
    }, [colspan, rowspan, style]);
    return (
        <Component style={customStyle} className={className}>
            {children}
        </Component>
    )
}
GridCell.defaultProps = {
    Component: 'div',
}