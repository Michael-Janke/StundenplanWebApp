import React from 'react';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import DateRange from '@material-ui/icons/DateRange';
import AccessTime from '@material-ui/icons/AccessTime';
import KeyboardIcon from '@material-ui/icons/Event';

export default (Component) => props => {
    const customProps = {
        leftArrowIcon: <KeyboardArrowLeft />,
        rightArrowIcon: <KeyboardArrowRight />,
        keyboardIcon: <KeyboardIcon />,
        dateRangeIcon: <DateRange />,
        timeIcon: <AccessTime />,
        cancelLabel: "Abbrechen",
        invalidDateMessage: "Ungültiges Datumsformat",
    };
    return (
        <Component
            {...props}
            {...customProps}
        />);
};