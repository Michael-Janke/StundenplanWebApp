import React from 'react';
import ThemedGridCell from './ThemedGridCell';
import PeriodEntity from '../Lesson/PeriodEntity';
import { makeStyles } from '@material-ui/styles';
import { classNames } from '../../Common/const';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    }
}), "LessonCell");

export default function LessonCell({ lessons, type, GridCellComponent, className, ...other }) {
    const classes = useStyles();
    return (
        <GridCellComponent {...other} className={classNames(classes.root, className)}>
            <PeriodEntity lessons={lessons} type={type}></PeriodEntity>
        </GridCellComponent>
    )
}

LessonCell.defaultProps = {
    GridCellComponent: ThemedGridCell,
}