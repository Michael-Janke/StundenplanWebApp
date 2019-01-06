import React from 'react';
import { withStyles, ButtonBase, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
const styles = theme => ({
    root: {
    },
    button: {
        display: 'flex',
        flex: 1,
        margin: theme.spacing.unit / 2,
        justifyContent: 'flex-start',
        padding: theme.spacing.unit,
        transition: theme.transitions.create(['box-shadow', 'color']),
        boxShadow: theme.shadows[0],
        '&:hover': {
            color: 'var(--color)',
            boxShadow: `0 .2rem .4rem -.075rem rgba(0,0,0,.1)`,
        }
    },
    ripple: {
        color: 'var(--color)',
    },
    icon: {
    },
    name: {
        paddingLeft: theme.spacing.unit * 1.5,
        color: 'inherit',
    }
});


const Waffle = ({ classes, name, waffle, onClick }) => {
    return (
        <ButtonBase
            TouchRippleProps={{ classes: { ripple: classes.ripple } }}
            className={classes.button}
            style={{ '--color': waffle.color }}
            onClick={onClick}
            {...(
                waffle.router ?
                    {
                        component: Link,
                        to: waffle.link,
                        replace: true,
                    }
                    : {
                        href: waffle.link,
                        component: 'a',
                        target: "_blank",
                    }
            )}>
            <waffle.icon className={classes.icon} />
            <Typography className={classes.name}>
                {name}
            </Typography>
        </ButtonBase>
    );
}


export default withStyles(styles)(Waffle)
