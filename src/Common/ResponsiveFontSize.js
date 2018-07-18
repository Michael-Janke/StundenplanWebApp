import React from "react";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
    root: {
        height: '100%',
        [theme.breakpoints.down('xs')]: {
            fontSize: 15,
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: 16,
        },
        [theme.breakpoints.up('md')]: {
            fontSize: 17,
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: 18,
        },
        [theme.breakpoints.up('xl')]: {
            fontSize: 18,
        },
    },
});

const ResponsiveFontSize = (props) => {
    const { classes } = props;
    return (
        <div className={classes.root}>
            {props.children}
        </div>
    );
}

export default withStyles(styles)(ResponsiveFontSize);