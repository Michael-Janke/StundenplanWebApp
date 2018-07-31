
import React from 'react';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardIcon from '@material-ui/icons/Event';
export default (Component) => props => (
    <Component
        {...props}
        leftArrowIcon={<KeyboardArrowLeft />}
        rightArrowIcon={<KeyboardArrowRight />}
        keyboardIcon={<KeyboardIcon />}
        cancelLabel="Abbrechen"
        invalidDateMessage="Ungültiges Datumsformat"

    />
);