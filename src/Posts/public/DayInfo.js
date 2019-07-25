import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { getDayInfo } from '../actions';
import { Typography } from '@material-ui/core';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        flexBasis: 0,
        color: 'white',
        padding: theme.spacing(2),
        height: '100%',
    },
    headerContainer: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'flex-end',
        position: 'relative',
    },
    textContainer: {
        position: 'relative',
        flexGrow: 2,
    },
    text: {
        position: 'absolute',
        top: 0,
    },
    textEnter: {
        opacity: 0,
    },
    textEnterActive: {
        transition: theme.transitions.create(['opacity']),
        opacity: 1,
    },
    textExit: {
        opacity: 1,
    },
    textExitActive: {
        transition: theme.transitions.create(['opacity']),
        opacity: 0,
    },
    header: {
        position: 'absolute',
        bottom: 0,
    },
    headerEnter: {
        opacity: 0,
    },
    headerEnterActive: {
        transition: theme.transitions.create(['opacity']),
        opacity: 1,
    },
    headerExit: {
        opacity: 1,
    },
    headerExitActive: {
        transition: theme.transitions.create(['opacity']),
        opacity: 0,
    },
}));

function DayInfo({ dayInfo = [], getDayInfo }) {
    const classes = useStyles();
    const infos = dayInfo.length;
    const [currentId, setCurrentId] = useState(0);
    useEffect(getDayInfo, []);
    useEffect(() => {
        const id = setInterval(() => {
            let newId = currentId + 1;
            if (newId >= infos) {
                newId = 0;
            }
            setCurrentId(newId);
        }, 20 * 1000);
        return () => clearInterval(id);
    });
    const info = dayInfo[currentId] || {};
    return (
        <div className={classes.root}>
            <TransitionGroup className={classes.headerContainer}>
                <CSSTransition
                    className={classes.header}
                    classNames={{
                        enter: classes.headerEnter,
                        enterActive: classes.headerEnterActive,
                        exit: classes.headerExit,
                        exitActive: classes.headerExitActive,
                    }}
                    key={info.header}
                    timeout={300}
                >
                    <Typography variant="h4" color="inherit">
                        {info.header}
                    </Typography>
                </CSSTransition>
            </TransitionGroup>
            <TransitionGroup className={classes.textContainer}>
                <CSSTransition
                    className={classes.text}
                    classNames={{
                        enter: classes.textEnter,
                        enterActive: classes.textEnterActive,
                        exit: classes.textExit,
                        exitActive: classes.textExitActive,
                    }}
                    key={info.text}
                    timeout={300}
                >
                    <div>
                        <Typography variant="body2" color="inherit">
                            {info.text}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="a" href={info.href}>
                            {info.href}
                        </Typography>
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
}

const mapStateToProps = state => ({
    dayInfo: state.tv.dayInfo,
});

const mapDispatchToProps = dispatch => ({
    getDayInfo: () => dispatch(getDayInfo()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DayInfo);
