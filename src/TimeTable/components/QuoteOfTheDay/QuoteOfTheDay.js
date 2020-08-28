import React, { useState } from 'react';
import useInterval from 'react-useinterval';
import { quotes } from './quotes';
import makeStyles from '@material-ui/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

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

export const QuoteOfTheDay = () => {
    const classes = useStyles();
    const [i, setI] = useState(Math.floor(Date.now() / 1000 / 60 / 60) % quotes.length);

    useInterval(() => setI(Math.floor(Date.now() / 1000 / 60 / 60) % quotes.length), 60 * 1000);
    const { quote, author, authorSub } = quotes[i];
    return (
        <Card className={classes.card}>
            <CardHeader title={author} subheader={authorSub} />
            <CardContent className={classes.content}>{quote}</CardContent>
        </Card>
    );
};
