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
import Tooltip from '@material-ui/core/Tooltip';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
    card: ({ fixedHeight }) => ({
        maxWidth: 500,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
    }),
    mediaWrapper: {
        overflow: 'hidden',
        flex: 1,
        position: 'relative',
    },
    media: {
        objectFit: 'contain',
        display: 'block',
        width: '100%',
    },
    title: {
        maxHeight: 64,
        padding: theme.spacing(1.5),
        paddingBottom: 0
    },
    input: {
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
        '&:last-child': {
            paddingBottom: theme.spacing(2),
        },
        paddingBottom: theme.spacing(2),
    },
}));

const Post = ({
    className,
    images,
    title,
    upn,
    content,
    edit,
    onUpdateTitle,
    onUpdateContent,
    noButtons,
    buttons,
    fixedHeight,
}) => {
    const classes = useStyles({ fixedHeight });
    const image = images && images[0];
    return (
        <Card className={classNames(className, classes.card)}>
            <div className={classes.mediaWrapper}>
                {image && <APIImage src={image} className={classes.media} />}
                <div className={classes.title}>
                    <InputBase
                        className={classes.input}
                        value={title}
                        readOnly={!edit}
                        onChange={(e) => onUpdateTitle(e.target.value)}
                        fullWidth
                    />
                </div>
            </div>

            <CardHeader
                avatar={<ObjectIcon upn={upn} profilePicSize={20} />}
                action={
                    !noButtons && (
                        <>
                            <Tooltip title={`Mail an ${upn} senden`}>
                                <IconButton onClick={() => sendMail(upn)}>
                                    <MailIcon />
                                </IconButton>
                            </Tooltip>
                            {buttons}
                        </>
                    )
                }
                title={<><Name upn={upn} /> - <Title upn={upn} /></>}
            />
            <CardContent className={classes.content}>
                {!edit ? <ReadOnlyEditor content={content} /> : <Editor onChange={onUpdateContent} content={content} />}
            </CardContent>
        </Card>
    );
};

export default Post;
