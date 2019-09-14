import React from 'react';
import { makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { getTransportInfo } from '../../actions';
import Station from './Station';
import Connection from './Connection';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(.5),
    },
    content: {
        display: 'flex',
    },
    station: {
        flexGrow: 1,
    }
}), { name: 'TransportInfo' })

function TransportInfo({ transportInfo, getTransportInfo }) {
    const classes = useStyles();

    // const lastUpdate = transportInfo && moment(transportInfo.TIME.date).format("HH:mm:ss");

    // fetch transportInfo
    React.useEffect(() => {
        const id = setInterval(getTransportInfo, 20 * 1000);
        getTransportInfo();
        return () => clearInterval(id);
    }, [getTransportInfo]);

    return (
        <div className={classes.root}>
            <div className={classes.content}>

                {transportInfo && Object.entries(transportInfo.CONNECTIONS).map(entry => {
                    const stationName = entry[0];
                    const arrivals = entry[1];
                    return (
                        <Station name={stationName} className={classes.station} key={stationName}>
                            {arrivals.map((arrival, i) =>
                                <Connection connection={arrival} key={arrival.name + arrival.time + i} />)}
                        </Station>
                    )
                })}

            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    transportInfo: state.tv.transportInfo,
});

const mapDispatchToProps = dispatch => ({
    getTransportInfo: () => dispatch(getTransportInfo()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransportInfo);