import React, { useMemo, useState, useEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Close from '@material-ui/icons/ArrowBack';
import { ObjectIcon } from '../../../Main/components/Avatars';
import { changeWeek } from '../../../Main/actions';
import { Paper, Grow, Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexWrap: 'wrap',
    },
    image: {
        display: 'flex',
        flexDirection: 'column',
        width: '20%',
    },
    avatar: {
        width: 80,
        height: 80,
    },
}));

function FastSelect({ open }) {
    const classes = useStyles();
    const students = useSelector((state) => state.timetable.masterdata.Student);
    const dispatch = useDispatch();
    const [filter, setFilter] = useState('');

    useEffect(() => setFilter(''), [open]);

    const initials = useMemo(
        () =>
            Object.values(students).reduce((acc, student) => {
                const initial = student.LASTNAME.match(/^(sch|\w)/i)[1].toUpperCase();
                acc[initial] = acc[initial] ? acc[initial] : [];
                acc[initial].push(student);
                return acc;
            }, {}),
        [students]
    );

    const count = filter === '' ? Object.keys(initials).length : initials[filter].length + 1;
    const width = Math.min(100 / Math.ceil(count / 7), 20);

    return (
        <>
            <Grow in={open && !filter.length}>
                <Paper className={classes.root} square style={{ flex: open ? 1 : 'none' }}>
                    {Object.keys(initials)
                        .sort()
                        .map((initial) => (
                            <ButtonBase
                                focusRipple
                                key={initial}
                                className={classes.image}
                                onClick={() => setFilter(initial)}
                            >
                                <Avatar className={classes.avatar}>{initial}</Avatar>
                            </ButtonBase>
                        ))}
                </Paper>
            </Grow>
            <Grow in={open && !!filter.length}>
                <Paper className={classes.root} square style={{ flex: open ? 1 : 'none' }}>
                    <ButtonBase className={classes.image} onClick={() => setFilter('')} style={{ width: width + '%' }}>
                        <Close />
                    </ButtonBase>
                    {initials[filter] &&
                        initials[filter]
                            .sort((a, b) => (a.LASTNAME < b.LASTNAME ? -1 : 1))
                            .map((student) => (
                                <ButtonBase
                                    focusRipple
                                    key={student.STUDENT_ID}
                                    className={classes.image}
                                    style={{ width: width + '%' }}
                                    onClick={() => dispatch(changeWeek('now', student.STUDENT_ID, 'student'))}
                                >
                                    <ObjectIcon upn={student.UPN} type="student" size={40} outline={true} />
                                    <Typography component="span" variant="subtitle1" color="inherit">
                                        {student.FIRSTNAME.split(' ')[0]}
                                    </Typography>
                                    <Typography component="span" variant="subtitle1" color="inherit">
                                        {student.LASTNAME}
                                    </Typography>
                                </ButtonBase>
                            ))}
                </Paper>
            </Grow>
        </>
    );
}

export default FastSelect;
