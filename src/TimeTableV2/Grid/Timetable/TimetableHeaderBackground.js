import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { grey } from '@material-ui/core/colors';
import CalendarIcon from '@material-ui/icons/Event';
import { animated } from 'react-spring';

const useStyles = makeStyles(
    theme => ({
        root: {
            backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
            height: '100%',
            width: '100%',
        },
        icon: {
            // padding: `${theme.spacing(0.5)}px ${theme.spacing(4)}px`,
            color: theme.palette.text.secondary,
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: 'center',
        },
    }),
    { name: 'HeaderBackground' }
);

export default function HeaderBackground({ row, GetHeightComponent, width }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <animated.div style={{ width: width, display: 'flex', alignItems: 'center', height: '100%' }}>
                <GetHeightComponent row={row}>
                    <div className={classes.icon}>
                        <CalendarIcon fontSize="inherit"></CalendarIcon>
                    </div>
                </GetHeightComponent>
            </animated.div>
        </div>
    );
}
