import React, { useState, useEffect } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { getTransportInfo } from '../../actions';
import Connection from './Connection';
import DepartureBoard from '@material-ui/icons/DepartureBoard';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        height: '100%',
        borderRadius: 0,
    },
}));

function TransportInfo({ transportInfo, getTransportInfo }) {
    const classes = useStyles();
    const [, setSeconds] = useState(0);

    // fetch transportInfo
    useEffect(() => {
        const id = setInterval(getTransportInfo, 60 * 1000);
        getTransportInfo();
        return () => clearInterval(id);
    }, [getTransportInfo]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((seconds) => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!transportInfo) return null;
    let wolkenberg = transportInfo.CONNECTIONS['Am Wolkenberg'];
    const michendorf = transportInfo.CONNECTIONS['Michendorf']
        .filter((m) => !wolkenberg.some((w) => m.name + m.direction === w.name + w.direction))
        .slice(0, 7);
    wolkenberg = wolkenberg.slice(0, 4);

    const uptodate = moment().diff(moment(transportInfo.TIME.date), 'seconds') < 65;

    return (
        <Card className={classes.root}>
            <CardHeader avatar={<DepartureBoard />} title={'Am Wolkenberg'} />
            <CardContent>
                {wolkenberg.map((arrival, i) => (
                    <Connection connection={arrival} key={i} />
                ))}
            </CardContent>
            <CardHeader avatar={<DepartureBoard />} title={'Michendorf ~10 Minuten 🚶'} />
            <CardContent>
                {michendorf.map((arrival) => (
                    <Connection connection={arrival} key={arrival.time + arrival.name} />
                ))}
            </CardContent>
            {uptodate}
            {!uptodate && (
                <Typography variant="subtitle2" style={{ marginLeft: 8 }}>
                    Stand: {moment(transportInfo.TIME.date).format('HH:mm')}
                </Typography>
            )}
        </Card>
    );
}

const mapStateToProps = (state) => ({
    transportInfo: state.tv.transportInfo,
});

const mapDispatchToProps = (dispatch) => ({
    getTransportInfo: () => dispatch(getTransportInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransportInfo);
