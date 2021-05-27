import React from 'react';
import {
    withStyles,
    CardContent,
    Card,
    Typography,
    ListItem,
    ListItemIcon,
    Button,
    CardActions,
} from '@material-ui/core';
import CloudOff from '@material-ui/icons/CloudOff';
import purple from '@material-ui/core/colors/purple';
import { Transition } from 'react-transition-group';
import { useTheme } from '@material-ui/styles';

const styles = (theme) => ({
    appear: { opacity: 1, maxWidth: '100%' },
    appearActive: { opacity: 1, maxWidth: '100%' },
    enter: { opacity: 1, maxWidth: '100%' },
    enterDone: { opacity: 1, maxWidth: '100%' },
    exitActive: { opacity: 0.2, maxWidth: 0 },
    exit: { opacity: 0, maxWidth: 0 },
    root: {
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        opacity: 0,
    },
    content: {
        alignItems: 'flex-start',
        padding: 0,
    },
    icon: {
        color: purple[600],
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
});

const childrenStyles = {
    entering: { filter: 'blur(1px)' },
    entered: { filter: 'blur(1px)' },
    exiting: { filter: 'blur(0px)' },
    exited: { filter: 'blur(0px)' },
};

const cardStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};

function OfflinePaper({ classes, retry, children, in: inProp, component, className }) {
    const theme = useTheme();
    return (
        <Transition appear in={inProp} timeout={300}>
            {(state) => {
                return (
                    <div className={className}>
                        {React.cloneElement(children, {
                            style: {
                                ...childrenStyles[state],
                                transition: theme.transitions.create('filter'),
                            },
                        })}
                        {state !== 'exited' && (
                            <div
                                className={classes.root}
                                style={{
                                    ...cardStyles[state],
                                    transition: theme.transitions.create('opacity'),
                                }}
                            >
                                <Card elevation={10}>
                                    <CardContent>
                                        <ListItem dense className={classes.content}>
                                            <ListItemIcon>
                                                <CloudOff fontSize="large" className={classes.icon} />
                                            </ListItemIcon>
                                            <div>
                                                <Typography variant="h6">Offline</Typography>
                                                <Typography>
                                                    Du bist offline. Bitte überprüfe deine Interneteinstellungen und
                                                    versuche es erneut.
                                                </Typography>
                                            </div>
                                        </ListItem>
                                    </CardContent>
                                    <CardActions className={classes.cardActions}>
                                        <Button size="small" color="primary" onClick={retry}>
                                            Erneut versuchen
                                        </Button>
                                    </CardActions>
                                </Card>
                            </div>
                        )}
                    </div>
                );
            }}
        </Transition>
    );
}

export default withStyles(styles)(OfflinePaper);
