import React from 'react';
import ThemedGridCell from './ThemedGridCell';
import PeriodEntity from '../Lesson/PeriodEntity';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(.5),
    }
}), "LessonCell");

export default function LessonCell({ lessons, type, GridCellComponent, className, children, ...other }) {
    const classes = useStyles();
    return (
        <GridCellComponent {...other} className={classNames(classes.root, className)}>
            {children || <PeriodEntity lessons={lessons} type={type}></PeriodEntity>}
        </GridCellComponent>
    )
}

LessonCell.defaultProps = {
    GridCellComponent: ThemedGridCell,
}