import React from 'react';
import ThemedGridCell from './ThemedGridCell';
import PeriodEntity from '../Lesson/PeriodEntity';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(0.5),
            borderLeft: props => props.multiple && `1px solid rgb(224,224,224)`,
        },
    }),
    'LessonCell'
);

export default function LessonCell({ lessons, type, GridCellComponent, className, children, ...other }) {
    const classes = useStyles({ multiple: lessons && lessons.length > 1});
    return (
        <GridCellComponent {...other} className={classNames(classes.root, className)}>
            {children || <PeriodEntity lessons={lessons} type={type}></PeriodEntity>}
        </GridCellComponent>
    )
}

LessonCell.defaultProps = {
    GridCellComponent: ThemedGridCell,
}