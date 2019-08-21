import React from 'react';

export default function GridCell({ children, colspan = 1, rowspan = 1, className }) {
    var style = React.useMemo(() => {
        if (colspan === 1 && rowspan === 1) {
            // performance: no custom styles needed;
            return undefined;
        }
        return {
            gridColumn: 'auto / span ' + colspan,
            gridRow: 'auto / span ' + rowspan,
        }
    }, [colspan, rowspan]);
    return (
        <div style={style} className={className}>
            {children}
        </div>
    )
}