import React from 'react';

import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import DateRange from '@material-ui/icons/DateRange';
import AccessTime from '@material-ui/icons/AccessTime';
import KeyboardIcon from '@material-ui/icons/Event';
import { TextField } from '@material-ui/core';

function EnhancedTextField(props) {
    let newProps = {};
    Object.keys(props).forEach(prop => {
        if (TextField.propTypes[prop]) {
            newProps[prop] = props[prop];
        }
    });
    return (
        <TextField {...newProps}/>
    );
}

export default (Component) => props => {
    const customProps = {
        leftArrowIcon: <KeyboardArrowLeft />,
        rightArrowIcon: <KeyboardArrowRight />,
        keyboardIcon: <KeyboardIcon />,
        dateRangeIcon: <DateRange />,
        timeIcon: <AccessTime />,
        cancelLabel: "Abbrechen",
        invalidDateMessage: "Ungültiges Datumsformat",
        TextFieldComponent: EnhancedTextField
    };
    return (
        <Component
            {...props}
            {...customProps}
        />);
};