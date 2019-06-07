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
const styles = theme => ({
    root: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
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

function OfflinePaper({ classes, retry }) {
    return (
        <Card elevation={0} className={classes.root}>
            <CardContent>
                <ListItem dense className={classes.content}>
                    <ListItemIcon>
                        <CloudOff fontSize="large" className={classes.icon} />
                    </ListItemIcon>
                    <div>
                        <Typography variant="h6">Offline</Typography>
                        <Typography>
                            Du bist offline. Bitte überprüfe deine Interneteinstellungen und versuche es erneut.
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
    );
}

export default withStyles(styles)(OfflinePaper);
