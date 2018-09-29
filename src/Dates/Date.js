import React from 'react';
import styled from 'styled-components';
import EditIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import IconButton from '@material-ui/core/IconButton';
import grey from '@material-ui/core/colors/grey';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    HOLIDAY: {
        color: theme.palette.type === 'dark' ? green[200] : green[600],
        fontWeight: 'bold',
    },
    EXKURSION: {
        color: theme.palette.type === 'dark' ? orange[200] : orange[600],
    },
    NORMAL: {
        color: theme.palette.type === 'dark' ? grey[200] : grey[800]
    },
    EXAM: {
        color: theme.palette.type === 'dark' ? red[200] : red[800],
        fontWeight: 'bolder',
    },
    dateStrings: {
        color: theme.palette.text.primary,
    },
});
function Date({ date, onEdit, onDelete, classes }) {
    if (!date) return;
    let dateFrom = date.DATE_FROM && moment(date.DATE_FROM.date).format("DD.MM.");
    let dateTo = date.DATE_TO && moment(date.DATE_TO.date).format("DD.MM.");
    let timeFrom = date.DATE_FROM && moment(date.DATE_FROM.date).format("HH:mm");
    let timeTo = date.DATE_TO && moment(date.DATE_TO.date).format("HH:mm");
    return (
        <Container>
            <DateStrings className={classes.dateStrings}>
                <DateFrom>
                    {dateFrom}
                </DateFrom>
                <DateTo>
                    {dateFrom !== dateTo ? dateTo : ''}
                    {timeFrom !== '00:00' ? timeFrom : ''}
                    {timeFrom !== timeTo ? '-' + timeTo : ''}
                </DateTo>
            </DateStrings>
            <Text>
                <Primary className={classes[date.TYPE]}>
                    {date.TEXT}
                </Primary>
                <Secundary>
                    {date.SUBTEXT}
                </Secundary>
            </Text>
            {onEdit && <IconButton onClick={onEdit}><EditIcon /></IconButton>}
            {onDelete && <IconButton onClick={onDelete}><DeleteIcon /></IconButton>}
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    padding: 16px;
    padding-bottom: 8px;
    padding-top: 8px;
`;

const DateStrings = styled.div`
    display: flex;
    flex-direction: column;
    width: 25%;
`;

const DateFrom = styled.div`
    font-size: 80%;
`;

const DateTo = styled.div`
    font-size: 70%;
    color: grey;
`;

const Text = styled.div`
    margin-left: 10px;
    display: flex;
    flex:1;
    flex-direction: column;
`;

const Primary = styled.div`
    font-size: 70%;
    word-break: break-word;
`;

const Secundary = styled.div`
    font-size: 60%;
    color: grey;
`;

export default withStyles(styles)(Date);
