import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { ReactComponent as RocketIcon } from './Icons/rocket.svg';

const useStyles = makeStyles(() => ({
    '@keyframes wiggle': {
        '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)'
        },

        '20%, 80%, 100%': {
            transform: 'translate3d(2px, 0, 0)'
        },

        '30%, 50%, 70%': {
            transform: 'translate3d(-1px, 0, 0)'
        },

        '40%, 60%': {
            transform: 'translate3d(2px, 0, 0)'
        },
    },
    '@keyframes launch': {
        '0%': {
            transform: 'translate(0px, 0px)',
        },
        '100%': {
            transform: 'translate(0px, -150vh)',
        }
    },
    root: {
        position: 'absolute',
        width: '100px',
        height: '100px',
        zIndex: 100,
        top: -100
    },
    launch: {
        animationName: '$launch',
        animationDuration: '2s',
        animationTimingFunction: 'cubic-bezier(0.27, 0.38, 1, -0.19)',
        animationFillMode: 'forwards',

    },
    crash: {
        animationName: '$launch',
        animationDuration: '1s',
        animationTimingFunction: 'cubic-bezier(0.33, 0.22, 0.08, -0.35)',
        animationFillMode: 'forwards',
        animationDirection: 'reverse',
        opacity: 1,

    },
    wiggle: {
        animationName: '$wiggle',
        animationDuration: '0.87s',
        animationIterationCount: 2,
    }


}));


function Rocket({ launched, crash }) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            {launched && (
                <div className={classes.wiggle}>
                    <div className={crash ? classes.crash : classes.launch}>
                        <RocketIcon></RocketIcon>
                    </div>
                </div>
            )}
        </div >
    )
};

export default Rocket;