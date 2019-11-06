import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ReportList from './ReportList';
import { loadReport } from './actions';
import TeacherDropdown from './TeacherDropdown';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
        height: '100%',
        backgroundColor: theme.palette.background.default,
    },
    header: {
        maxWidth: 800,
        margin: '0 auto',
        padding: `${theme.spacing(2)}px`,
        textAlign: 'center',
    },
    layout: {
        maxWidth: 800,
        width: 'auto',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: theme.spacing(2),
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    list: {
        backgroundColor: theme.palette.background.paper,
        width: 400,
    },
}));

function Report() {
    const classes = useStyles();
    const myId = useSelector(state => state.user.id);
    const isAdmin = useSelector(state => state.user.scope == 'admin');
    const [id, setId] = useState(myId);
    const [showNeutral, setShowNeutral] = useState(false);
    const report = useSelector(state => state.report[id]);

    const dispatch = useDispatch();
    if (!report) {
        dispatch(loadReport(id));
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography variant="h6" align="center" color="textSecondary">
                    Bericht von <TeacherDropdown value={id} onChange={e => setId(e.target.value)} disabled={!isAdmin} />
                </Typography>
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
                {report && report.substitutions && <ReportList report={report} showNeutral={showNeutral} />}
            </div>
        </div>
    );
}

export default Report;
