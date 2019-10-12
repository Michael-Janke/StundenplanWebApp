import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { ObjectIcon } from '../../../Main/components/Avatars';
import { setTimeTable } from '../../../Main/actions';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default,
        height: 1080 - 82,
        display: 'flex',
        flexWrap: 'wrap',
    },
    image: {
        display: 'flex',
        flexDirection: 'column',
    },
}));

function InformationComponent({}) {
    const classes = useStyles();
    const teacher = useSelector(state => state.timetable.masterdata.Teacher);
    const dispatch = useDispatch();

    return (
        <div className={classes.root}>
            {Object.values(teacher)
                .sort((a, b) => (a.LASTNAME < b.LASTNAME ? -1 : 1))
                .map(teacher => (
                    <ButtonBase
                        focusRipple
                        key={teacher.TEACHER_ID}
                        className={classes.image}
                        style={{
                            width: '16.66667%',
                        }}
                        onClick={() => dispatch(setTimeTable('teacher', teacher.TEACHER_ID))}
                    >
                        <ObjectIcon upn={teacher.UPN} type="teacher" size={40} outline={true} />
                        <Typography component="span" variant="subtitle1" color="inherit" className={classes.imageTitle}>
                            {teacher.LASTNAME.length > 10 ? '' : teacher.FIRSTNAME[0] + '.'} {teacher.LASTNAME}
                        </Typography>
                    </ButtonBase>
                ))}
        </div>
    );
}

export default InformationComponent;
