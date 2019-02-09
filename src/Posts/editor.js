import React from 'react';
import { Editor } from 'draft-js';
import { COLOR_STYLE_MAP } from '../Common/const';
import Immutable from 'immutable';
import { Typography } from '@material-ui/core';

const blockRenderMap = Immutable.Map({
    'small': {
        element: 'span',
        wrapper: <Typography variant="body2" component="div"></Typography>
    },
    'unstyled': {
        element: 'span',
        wrapper: <Typography variant="body1" component="div"></Typography>
    }
});

export default React.forwardRef(function (props, ref) {
    return (
        <Editor
            {...props}
            ref={ref}
            blockRenderMap={blockRenderMap}
            customStyleMap={COLOR_STYLE_MAP}
        />
    )
})