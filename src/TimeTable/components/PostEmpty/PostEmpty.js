import React from 'react';
import { useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 500,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        marginBottom: theme.spacing(1),
    },
    content: {
        paddingTop: 0,
        '&:last-child': {
            paddingBottom: theme.spacing(2),
        },
        paddingBottom: theme.spacing(2),
    },
}));

export const PostEmpty = () => {
    const classes = useStyles();
    const history = useHistory();
    return (
        <Card className={classes.card}>
            <CardHeader title="Post erstellen" />
            <CardContent className={classes.content}>
                Ganz schön leer hier. Erstelle doch eine Diashow von der letzten Exkursion.
                <br />
                <br />
                <div>
                    <Button variant="outlined" color="primary" onClick={() => history.push('/posts/new/post')}>
                        Beitrag erstellen
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => history.push('/posts/new/diashow')}>
                        Diashow erstellen
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
