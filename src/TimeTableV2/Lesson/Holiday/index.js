import React from 'react';
import easterImg from './easter.jpg';
import bridgeImg from './bridge.jpg';
import firstMayImg from './firstMay.jpg';
import summerImg from './summer.jpg';
import autumnImg from './autumn.jpg';
import xmasImg from './xmas.jpg';
import winterImg from './winter.jpg';
import germanImg from './german.jpg';
import ascentionImg from './ascention.jpg';
import flowerImg from './flower.jpg';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

export const holidayImageMap = {
    Oster: easterImg,
    Ferientag: bridgeImg,
    '01.05': firstMayImg,
    Sommer: summerImg,
    Herbst: autumnImg,
    Weihn: xmasImg,
    Winter: winterImg,
    '3.10': germanImg,
    Himmel: ascentionImg,
    Pfings: flowerImg,
};

var images = [];
function preload(pImages) {
    for (var i = 0; i < pImages.length; i++) {
        images[i] = new Image();
        images[i].src = pImages[i];
    }
}
setTimeout(() => preload(Object.values(holidayImageMap)), 5000);

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: '100%',
        backgroundImage: props => `url(${props.img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: 'inset 0 0 5px #ffffff',
    },
    text: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        marginTop: '5vh',
        marginRight: '2vw',
        marginBottom: 'auto',
        width: '100%',
        padding: theme.spacing(2),
        color: 'white',
    },
}));

export default function Holiday({holiday, date}) {
    var img = bridgeImg;
    for (var key in holidayImageMap) {
        if (holiday.indexOf(key) >= 0) {
            img = holidayImageMap[key];
        }
        if (date && date.indexOf(key) >= 0) {
            img = holidayImageMap[key];
        }
    }
    const classes = useStyles({ img: img });
    return (
        <div className={classes.root}>
            <Typography variant="body1" className={classes.text}>
                {holiday}
            </Typography>
        </div>
    );
}