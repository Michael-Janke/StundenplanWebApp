import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ObjectIcon } from '../../Main/components/Avatars';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import moment from 'moment';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
    text: {
        transition: theme.transitions.create('padding'),
        [theme.breakpoints.down('xs')]: {
            padding: 0,
        },
    },
    item: {
        paddingRight: 0,
    },
});

const CurrentTimetableInformation = ({ type, id, masterdata, lastUpdate, small, classes }) => {
    if (!masterdata || !type || !id) return null;
    let object;
    if (type === 'all') {
        object = { NAME: 'Freie Räume' };
        type = 'room';
    } else {
        object = masterdata[type[0].toUpperCase() + type.slice(1)][id];
    }
    if (!object) return null;
    return (
        <ListItem className={classes.item}>
            <ListItemIcon>
                <ObjectIcon upn={object.UPN} type={type} profilePicSize={34} />
            </ListItemIcon>
            <ListItemText
                className={classes.text}
                disableTypography
                primary={
                    <Typography variant="subtitle2" noWrap>
                        {object.LASTNAME ? object.FIRSTNAME + ' ' + object.LASTNAME : object.NAME}
                    </Typography>
                }
                secondary={
                    <Typography variant="caption" noWrap>
                        {(small ? '' : 'Letzte Änderung ') + lastUpdate}
                    </Typography>
                }
            />
        </ListItem>
    );
};
const mapStateToProps = (state, { print }) => ({
    masterdata: state.timetable.masterdata,
    lastUpdate: print
        ? moment(state.user.lastUpdate).format('[am] dd, DD. MMMM YYYY')
        : moment(state.user.lastUpdate).fromNow(),
});

export default connect(mapStateToProps)(withStyles(styles)(CurrentTimetableInformation));
