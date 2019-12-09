import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ReportList from './ReportList';
import { useParams, useHistory } from 'react-router';
import { loadReport } from './actions';
import TeacherDropdown from './TeacherDropdown';
import Commit from './Commit';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: theme.palette.background.default,
    },
    header: {
        maxWidth: 800,
        margin: '0 auto',
        padding: `${theme.spacing(2)}px`,
        textAlign: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    layout: {
        maxWidth: 800,
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',

        marginLeft: 'auto',
        marginRight: 'auto',
        overflowY: 'auto',
    },
}));

function Report() {
    const classes = useStyles();
    const myId = useSelector(state => state.user.id);
    const isAdmin = useSelector(state => state.user.scope === 'admin');
    const id = useParams().id || myId;
    const [showNeutral, setShowNeutral] = useState(false);
    const report = useSelector(state => state.report[id]);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => dispatch(loadReport(id)), [id, dispatch]);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.row}>
                    <Typography variant="h6" align="center" color="textSecondary">
                        Bericht von{' '}
                        <TeacherDropdown
                            value={id}
                            onChange={e => history.replace('/report/' + e.target.value)}
                            disabled={!isAdmin}
                        />
                    </Typography>
                    <Commit />
                </div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showNeutral}
                            onChange={e => setShowNeutral(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Anzeige nicht zu zählender Vertretungen/Entfälle"
                />
            </div>
            <div className={classes.layout}>
                {(!report || report.loading) && <CircularProgress />}
                {report && report.error && <div>Fehler beim Laden</div>}
                {report && report.report && <ReportList report={report.report} showNeutral={showNeutral} />}
            </div>
        </div>
    );
}

export default Report;
