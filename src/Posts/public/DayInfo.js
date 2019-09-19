import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { getDayInfo } from '../actions';
import { Typography, Portal, Fade } from '@material-ui/core';
import { TransitionGroup } from 'react-transition-group';
import ReadProgress from './ReadProgress';

const useStyles = makeStyles(
    theme => ({
        root: {
            flexGrow: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            padding: theme.spacing(2),
            flex: 1,
        },
        headerContainer: {
            flexGrow: 1,
            display: 'flex',
            alignItems: 'flex-end',
            position: 'relative',
        },
        header: {
            position: 'absolute',
            bottom: 0,
        },
        backgroundContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            overflow: 'hidden',
            backgroundColor: theme.palette.background.default,
        },
        backgroundImage: {
            position: 'absolute',
            width: '100%',
            filter: 'blur(2px)',
            opacity: theme.palette.type === 'dark' ? 0.2 : 0.7,
        },
    }),
    { name: 'DayInfo' }
);

function DayInfo({ dayInfo = [], getDayInfo }) {
    const classes = useStyles();
    const infos = dayInfo.length;
    const [currentId, setCurrentId] = useState(0);
    const info = dayInfo[currentId] || {};

    const onFinished = React.useCallback(() => {
        let newId = currentId + 1;
        if (newId >= infos) {
            newId = 0;
        }
        setCurrentId(newId);
    }, [currentId, infos]);

    React.useLayoutEffect(() => {
        const root = document.getElementById('root').firstChild.style;
        root.backgroundColor = 'transparent';
    }, []);

    // fetch dayInfo once component was mounted
    useEffect(getDayInfo, []);

    return (
        <div className={classes.root}>
            <Portal>
                <TransitionGroup className={classes.backgroundContainer}>
                    <Fade key={info.image ? info.image.url : ''} appear timeout={1000}>
                        <div>
                            {info.image && info.image.url ? (
                                <img src={info.image.url} className={classes.backgroundImage} alt=""></img>
                            ) : (
                                <div className={classes.backgroundImage}></div>
                            )}
                        </div>
                    </Fade>
                </TransitionGroup>
            </Portal>
            <div className={classes.content}>
                <TransitionGroup className={classes.headerContainer}>
                    <Fade className={classes.header} key={info.header} timeout={1000}>
                        <div>
                            <Typography variant="h4" color="inherit">
                                {info.header}
                            </Typography>
                            <Typography variant="body2" color="inherit">
                                {info.text}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="a" href={info.href}>
                                {info.href}
                            </Typography>
                        </div>
                    </Fade>
                </TransitionGroup>
            </div>
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
