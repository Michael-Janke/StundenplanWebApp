import React from 'react';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import ExpandLessonContent from './ExpandLessonContent';
import ExpandPopover from './ExpandPopover';

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
        popover: {},
        open: {
            boxShadow: theme.shadows[20],
            zIndex: 1,
        },
    }),
    { name: 'ExpandLesson' }
);

export default function ExpandLesson({ children, lesson }) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    function handleToggle(newOpen) {
        if (typeof newOpen === 'boolean') {
            setOpen(newOpen);
        } else {
            setOpen(!open);
        }
    }

    function renderContent(props) {
        return (
            <div {...props} className={classNames(classes.root)} onClick={handleToggle}>
                {children}
            </div>
        );
    }

    return (
        <ExpandPopover renderContent={renderContent} open={open} onToggle={handleToggle}>
            <ExpandLessonContent lesson={lesson}></ExpandLessonContent>
        </ExpandPopover>
    );
}
