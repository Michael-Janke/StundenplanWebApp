import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { grey, indigo } from '@material-ui/core/colors';
import { darken } from '@material-ui/core/styles';
import useSpecificSubsitutionType from './useSpecificSubsitutionType';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        backgroundColor: props => props.backgroundColor || darken(indigo[50], theme.palette.type === 'dark' ? 0.6 : 0),
    },
    colorBar: {
        width: '3%',
        marginRight: 5,
        backgroundColor: props => props.color || grey[400],
    }
}), { name: "Lesson" });

export default function Lesson({ children, specificSubstitutionType }) {
    const styles = useSpecificSubsitutionType(specificSubstitutionType);
    const classes = useStyles(styles);


    return (
        <div className={classes.root}>
            <div className={classes.colorBar}></div>
            {children}
        </div>
    );
}