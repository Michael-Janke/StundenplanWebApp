import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import { ObjectIcon } from '../../Main/components/Avatars';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import moment from 'moment';
import { withStyles } from '@material-ui/core';

import { iterateTimetable } from '../../Main/actions';

const styles = (theme) => ({
    text: {
        transition: theme.transitions.create('padding'),
        [theme.breakpoints.down('xs')]: {
            padding: 0,
        },
    },
    item: {
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        gap: 8,
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
    },
});

const CurrentTimetableInformation = ({
    type,
    id,
    masterdata,
    lastUpdate,
    small,
    classes,
    setNextTimetable,
    setPreviousTimetable,
    isStudent,
}) => {
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
            <ObjectIcon upn={object.UPN} type={type} profilePicSize={40} />
            {!small && !isStudent && (
                <div className={classes.column}>
                    <IconButton size="small" onClick={setPreviousTimetable}>
                        <UpIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton size="small" onClick={setNextTimetable}>
                        <DownIcon fontSize="inherit" />
                    </IconButton>
                </div>
            )}
            <ListItemText
                className={classes.text}
                disableTypography
                primary={
                    <>
                        <Typography variant="subtitle2" noWrap>
                            {object.LASTNAME ? object.FIRSTNAME + ' ' + object.LASTNAME : object.NAME}
                        </Typography>
                    </>
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

const mapDispatchToProps = (dispatch) => ({
    setNextTimetable: () => dispatch(iterateTimetable(1)),
    setPreviousTimetable: () => dispatch(iterateTimetable(-1)),
});

const mapStateToProps = (state, { print }) => ({
    masterdata: state.timetable.masterdata,
    lastUpdate: print
        ? moment(state.user.lastUpdate).format('[am] dd, DD. MMMM YYYY')
        : moment(state.user.lastUpdate).fromNow(),
    isStudent: state.user.type === 'student',
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CurrentTimetableInformation));
