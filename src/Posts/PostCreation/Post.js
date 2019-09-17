import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import InputBase from '@material-ui/core/InputBase';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import APIImage from './APIImage';
import Text from './Text';

const useStyles = makeStyles(theme => ({
    root: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' },
    card: {
        width: 400,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
    },
    mediaWrapper: {
        height: 0,
        flex: 1,
        position: 'relative',
    },
    media: {
        objectFit: 'cover',
        height: '100%',
        width: '100%',
    },
    title: {
        position: 'absolute',
        maxHeight: 64,
        boxSizing: 'border-box',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.6)',
        padding: theme.spacing(2),
    },
    input: {
        color: 'white',
        fontSize: '1em',
        fontWeight: 'bolder',
        padding: 0,
        margin: 0,
        '& input': {
            padding: 0,
        },
    },
}));

const Post = ({ image }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <div className={classes.mediaWrapper}>
                    <APIImage src={image} className={classes.media} />
                    <div className={classes.title}>
                        <InputBase className={classes.input} value="Titel hier eingeben" />
                    </div>
                </div>

                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            R
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MailIcon />
                        </IconButton>
                    }
                    title="Michael Janke"
                    subheader="September 14, 2019"
                />
                <CardContent>
                    <Text />
                </CardContent>
            </Card>
        </div>
    );
};

export default Post;
