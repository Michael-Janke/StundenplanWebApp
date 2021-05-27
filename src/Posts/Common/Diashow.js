import React, { useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import APIImage from './APIImage';
import { sendMail } from '../../Common/utils';
import { ObjectIcon } from '../../Main/components/Avatars';
import Name from './Name';
import Title from './Title';
import { Tooltip } from '@material-ui/core';
import classNames from 'classnames';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
    card: ({ fixedHeight }) => ({
        maxWidth: 500,
        height: fixedHeight || 'unset',
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontSize: 17.5, //fix for all screensizes
    }),
    mediaWrapper: {
        overflow: 'hidden',
    },
    media: {
        objectFit: 'cover',
        height: '100%',
        width: '100%',
        display: 'block',
    },
    title: {
        position: 'absolute',
        maxHeight: 64,
        boxSizing: 'border-box',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.6)',
        padding: theme.spacing(2),
        color: 'white',
    },
    input: {
        color: 'white',
        fontSize: '1em',
        fontWeight: 'bolder',
        padding: 0,
        margin: 0,
        '& input': {
            padding: 0,
        },
    },
    content: {
        paddingTop: 0,
        paddingBottom: theme.spacing(2),
    },
}));

const Diashow = ({ images, title, upn, noButtons, interval = 5000, buttons, className, fixedHeight = false }) => {
    const classes = useStyles({ fixedHeight });
    const [activeStep, setActiveStep] = useState(0);
    return (
        <Card className={classNames(className, classes.card)}>
            <AutoPlaySwipeableViews
                axis={'x'}
                index={activeStep}
                onChangeIndex={(step) => setActiveStep(step)}
                enableMouseEvents
                interval={interval}
                className={classes.mediaWrapper}
                containerStyle={{ height: '100%' }}
                slideStyle={{ overflow: 'hidden' }}
            >
                {images.map((image) => (
                    <APIImage key={image} src={image} className={classes.media} />
                ))}
            </AutoPlaySwipeableViews>
            <div className={classes.title}>{title}</div>

            <CardHeader
                avatar={<ObjectIcon upn={upn} profilePicSize={40} />}
                action={
                    !noButtons && (
                        <>
                            <Tooltip title={`Mail an ${upn} senden`}>
                                <IconButton onClick={() => sendMail(upn)}>
                                    <MailIcon />
                                </IconButton>
                            </Tooltip>
                            {buttons}
                        </>
                    )
                }
                title={<Name upn={upn} />}
                subheader={<Title upn={upn} />}
            />
        </Card>
    );
};

export default Diashow;
