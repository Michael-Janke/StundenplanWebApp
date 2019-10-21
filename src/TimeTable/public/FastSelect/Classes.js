import React, { useMemo } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Group from '@material-ui/icons/Group';
import { changeWeek } from '../../../Main/actions';
import { Paper, Grow } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    },
    image: {
        display: 'flex',
        flexDirection: 'column',
        width: '20%',
    },
}));

function FastSelect({ open }) {
    const classes = useStyles();
    const data = useSelector(state => state.timetable.masterdata.Class);
    const dispatch = useDispatch();
    const grades = useMemo(
        () =>
            Object.values(data).reduce((acc, _class) => {
                const match = _class.NAME.match(/(\d+)([a-z]*)([^a-z]*)/);
                const group = match[2].length
                    ? match[1]
                    : match[3].length || parseInt(match[1]) <= 10
                    ? 'Akomisch'
                    : 'BJahrgagsstufe';
                acc[group] = acc[group] ? acc[group] : [];
                acc[group].push(_class);
                return acc;
            }, {}),
        [data]
    );
    return (
        <Grow in={open}>
            <Paper className={classes.root} square>
                {Object.keys(grades)
                    .sort()
                    .map(grade => (
                        <div className={classes.row}>
                            {grades[grade].map(class_ => (
                                <ButtonBase
                                    focusRipple
                                    key={class_.CLASS_ID}
                                    className={classes.image}
                                    onClick={() => dispatch(changeWeek('now', class_.CLASS_ID, 'class'))}
                                >
                                    <Group />
                                    <Typography component="span" variant="h6" color="inherit">
                                        {class_.NAME}
                                    </Typography>
                                </ButtonBase>
                            ))}
                        </div>
                    ))}
            </Paper>
        </Grow>
    );
}

export default FastSelect;
