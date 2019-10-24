import React from 'react';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import Lesson from './Lesson';
import ExpandLessonContent from './ExpandLessonContent';
import { Collapse } from '@material-ui/core';

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            flexDirection: 'column',

            flexGrow: 1,
            transition: theme.transitions.create(['margin', 'box-shadow', 'z-index']),
            zIndex: 0,
            margin: 0,
        },
        popover: {
            
        },
        open: {
            margin: '0 -48px',
            boxShadow: theme.shadows[20],
            zIndex: 1,
        },
    }),
    { name: 'ExpandLesson' }
);

export default function ExpandLesson({ children, lesson }) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    function handleClick() {
        setOpen(!open);
    }

    return (
        <div className={classNames(classes.root, open && classes.open)} onClick={handleClick}>
            {children}
            <div className={classes.popover}>
                <Collapse in={open}>
                    <Lesson>
                        <ExpandLessonContent lesson={lesson}></ExpandLessonContent>
                    </Lesson>
                </Collapse>
            </div>
        </div>
    );
}
