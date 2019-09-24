import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import APIImage from './APIImage';
import Editor from './Editor';
import ReadOnlyEditor from './EditorReadOnly';
import { sendMail } from '../../Common/utils';
import { ObjectIcon } from '../../Main/components/Avatars';
import Name from './Name';
import Title from './Title';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 500,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontSize: 17.5, //fix for all screensizes
        [theme.breakpoints.up('sm')]: {
            height: 480,
        },
    },
    mediaWrapper: {
        minHeight: 52,
        flex: 1,
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
            height: 0,
        },
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
    content: {
        paddingTop: 0,
        paddingBottom: theme.spacing(2),
    },
}));

const Post = ({ images, title, upn, content, edit, onUpdateTitle, onUpdateContent, noButtons }) => {
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <div className={classes.mediaWrapper}>
                {images && <APIImage src={images && images[0]} className={classes.media} />}
                <div className={classes.title}>
                    <InputBase
                        className={classes.input}
                        value={title}
                        readOnly={!edit}
                        onChange={e => onUpdateTitle(e.target.value)}
                        fullWidth
                    />
                </div>
            </div>

            <CardHeader
                avatar={<ObjectIcon upn={upn} profilePicSize={40} />}
                action={
                    !noButtons && (
                        <IconButton onClick={() => sendMail(upn)}>
                            <MailIcon />
                        </IconButton>
                    )
                }
                title={<Name upn={upn} />}
                subheader={<Title upn={upn} />}
            />
            <CardContent className={classes.content}>
                {!edit ? <ReadOnlyEditor content={content} /> : <Editor onChange={onUpdateContent} content={content} />}
            </CardContent>
        </Card>
    );
};

export default Post;
