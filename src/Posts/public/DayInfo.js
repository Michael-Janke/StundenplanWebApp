import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { getDayInfo } from '../actions';
import { Typography, Fade, Card } from '@material-ui/core';
import { TransitionGroup } from 'react-transition-group';
import useInterval from 'react-useinterval';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles(
    theme => ({
        root: {
            flexGrow: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            fontSize: 17.5,
        },
        media: {
            height: 200,
        },
        card: {
            position: 'absolute',
            top: 0,
            bottom: 0,
        },
    }),
    { name: 'DayInfo' }
);

function DayInfo({ dayInfo = [], getDayInfo }) {
    const classes = useStyles();
    const [currentId, setCurrentId] = useState(0);
    const info = dayInfo[currentId] || {};

    useInterval(() => setCurrentId((currentId + 1) % dayInfo.length), 20000);

    // fetch dayInfo once component was mounted
    useEffect(getDayInfo, []);

    return (
        <TransitionGroup className={classes.root}>
            <Fade className={classes.card} key={info.header} timeout={1000}>
                <Card>
                    <CardMedia className={classes.media} image={info.image && info.image.url} title={info.header} />
                    <CardContent>
                        <Typography variant="subtitle2">
                            Heute ist ({currentId + 1}/{dayInfo.length})
                        </Typography>
                        <Typography gutterBottom variant="h5" component="h2">
                            {info.header}
                        </Typography>
                        <Typography component="p" color="textSecondary">
                            {info.text}
                        </Typography>
                    </CardContent>
                </Card>
            </Fade>
        </TransitionGroup>
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
