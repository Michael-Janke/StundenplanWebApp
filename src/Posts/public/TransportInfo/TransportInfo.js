import React from 'react';
import { makeStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { getTransportInfo } from '../../actions';
import Connection from './Connection';
import DepartureBoard from '@material-ui/icons/DepartureBoard';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
    root: {
        flex: 1,
        height: '100%',
    },
}));

function TransportInfo({ transportInfo, getTransportInfo }) {
    const classes = useStyles();

    // fetch transportInfo
    React.useEffect(() => {
        const id = setInterval(getTransportInfo, 20 * 1000);
        getTransportInfo();
        return () => clearInterval(id);
    }, [getTransportInfo]);

    if (!transportInfo) return null;
    let wolkenberg = transportInfo.CONNECTIONS['Am Wolkenberg'];
    const michendorf = transportInfo.CONNECTIONS['Michendorf']
        .filter(m => !wolkenberg.some(w => m.name + m.direction === w.name + w.direction))
        .slice(0, 6);
    wolkenberg = wolkenberg.slice(0, 4);

    return (
        <Card className={classes.root}>
            <CardHeader avatar={<DepartureBoard />} title={'Am Wolkenberg'} />
            <CardContent>
                {wolkenberg.map((arrival, i) => (
                    <Connection connection={arrival} key={i} />
                ))}
            </CardContent>
            <CardHeader avatar={<DepartureBoard />} title={'Michendorf'} />
            <CardContent>
                {michendorf.map((arrival, i) => (
                    <Connection connection={arrival} key={i} />
                ))}
            </CardContent>
        </Card>
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
