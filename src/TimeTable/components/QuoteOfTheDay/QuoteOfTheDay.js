import React from 'react';
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
    const { quote, author, authorSub } = quotes[Math.floor(Date.now() / 1000 / 60 / 60 / 24) % quotes.length];
    const classes = useStyles();
    return (
        <Card className={classes.card}>
            <CardHeader title={author} subheader={authorSub} />
            <CardContent className={classes.content}>{quote}</CardContent>
        </Card>
    );
};
