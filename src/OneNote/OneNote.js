import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import OpenIcon from '@material-ui/icons/OpenInNew';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import OneNoteIcon from '../Common/icons/OneNote';
import { getTeamsNotebook, loadJoinedTeams, loadMe, loadMasterData } from '../Main/actions';
import makeGetCurrentTimetable from '../Selector/timetable';
import moment from 'moment';
import { useIntervalCheck } from '../Common/intervalCheck';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.palette.background.default,
    },
    headerContainer: {},
    header: {
        maxWidth: 800,
        margin: '0 auto',
        padding: `${theme.spacing(2)}px`,
        textAlign: 'center',
    },

    layout: {
        width: 'auto',
        display: 'flex',
        justifyContent: 'center',
    },
    list: {
        backgroundColor: theme.palette.background.paper,
        width: 400,
    },
}));

function NotebookSelector() {
    const classes = useStyles();
    const teams = useSelector((state) => state.teams.joinedTeams);
    const urls = useSelector((state) => state.teams.notebookUrls);
    const schoolyear = useSelector((state) => state.user.schoolyear);
    const masterdata = useSelector((state) => state.timetable.masterdata);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState({});

    useEffect(() => {
        dispatch(loadMe());
    }, [dispatch]);
    useEffect(() => {
        masterdata.version || dispatch(loadMasterData());
    }, [dispatch, masterdata]);
    useEffect(() => {
        schoolyear && dispatch(loadJoinedTeams());
    }, [schoolyear, dispatch]);
    useEffect(() => {
        teams
            .filter((team) => !urls[team.id])
            .slice(0, 2)
            .filter((team) => !loading[team.id])
            .forEach((team) => {
                dispatch(getTeamsNotebook(team.id));
                setLoading((loading) => ({ ...loading, [team.id]: true }));
            });
    }, [teams, dispatch, urls, loading]);

    const link = useRef();

    const open = useCallback(
        (id) => {
            link.current.href = urls[id].client + '/_Inhaltsbibliothek/';
            link.current.click();
        },
        [urls, link]
    );

    const getCurrentTimetable = useMemo(makeGetCurrentTimetable, []);
    const user = useSelector((state) => state.user);
    const weekday = moment().weekday();
    const period = useSelector((state) => state.period.currentPeriod) || {};
    const periodNumber = period.PERIOD_TIME_ID - 1;
    const props = useMemo(() => ({ type: user.type, id: user.id, date: moment().startOf('week') }), [user]);
    const timetable = useSelector((state) => getCurrentTimetable(state, props));
    const period0 =
        timetable && timetable[weekday] && timetable[weekday].periods && timetable[weekday].periods[periodNumber];
    const currentTeams0 =
        (period0 && period0.lessons.reduce((acc, lesson) => [...acc, ...lesson.teams], []).map((team) => team.id)) ||
        [];
    const period1 =
        timetable && timetable[weekday] && timetable[weekday].periods && timetable[weekday].periods[periodNumber + 1];
    const currentTeams1 =
        (period1 && period1.lessons.reduce((acc, lesson) => [...acc, ...lesson.teams], []).map((team) => team.id)) ||
        [];

    const params = useParams();
    const openTeam = params.directOpen && (currentTeams0[0] || currentTeams1[0]);
    const openTeamIfUrl = urls[openTeam] && openTeam;
    const [opened, setOpened] = useState(false);

    useEffect(() => {
        if (!opened && openTeamIfUrl) {
            open(openTeamIfUrl);
            setOpened(true);
        }
    }, [openTeamIfUrl, open, opened]);

    useIntervalCheck();

    return (
        <div className={classes.root}>
            <div className={classes.headerContainer}>
                <div className={classes.header}>
                    <Typography variant="h6" align="center" color="textSecondary">
                        Liste aktueller Klassen-Notizbücher
                    </Typography>
                    <a style={{ display: 'none' }} title="openframe" ref={link} href="/#">
                        Open Onenote
                    </a>
                </div>
            </div>
            <div className={classes.layout}>
                <List className={classes.list}>
                    {teams
                        .sort((a, b) => (a.displayName < b.displayName ? -1 : a.displayName > b.displayName ? 1 : 0))
                        .map((team) => (
                            <ListItem key={team.id} button disabled={!urls[team.id]} onClick={() => open(team.id)}>
                                <ListItemAvatar>
                                    <OneNoteIcon />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={team.displayName}
                                    secondary={
                                        (currentTeams0.indexOf(team.id) >= 0 && 'aktuelle Stunde') ||
                                        (currentTeams1.indexOf(team.id) >= 0 && 'nächste Stunde')
                                    }
                                />

                                <ListItemSecondaryAction onClick={() => open(team.id)}>
                                    <IconButton edge="end" aria-label="Notebook öffnen">
                                        <OpenIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                </List>
            </div>
        </div>
    );
}

export default NotebookSelector;
