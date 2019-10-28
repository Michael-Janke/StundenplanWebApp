import React from 'react';
import { DATE_COLORS } from '../../Common/const';
import { withStyles, Tooltip } from '@material-ui/core';

import indigo from '@material-ui/core/colors/indigo';
import { darken } from '@material-ui/core/styles';
import classNames from 'classnames';
import Lesson from '../Lesson/Lesson';

const styles = theme => ({
    dates: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dateWrapper: {
        paddingTop: '0.25vmin',
        paddingRight: '0.25vmin',
        boxSizing: 'border-box',
    },
    date: {
        overflow: 'hidden',
        backgroundColor: darken(indigo[50], theme.palette.type === 'dark' ? 0.6 : 0),
        display: 'flex',
        height: '100%',
    },
    dateText: {
        flex: 1,
        fontSize: '70%',
        overflow: 'hidden',
        wordBreak: 'break-word',
        padding: 2,
    },

    ...DATE_COLORS(theme),
});

const Dates = ({ dates, classes }) => {
    if (!dates || dates.length === 0) return null;
    return (
        <div className={classes.dates}>
            {dates.map(date => (
                <React.Fragment key={date.DATE_ID}>
                    <div style={{ width: date.leftSpan * 20 + '%' }} />
                    <div style={{ width: date.duration * 20 + '%' }} className={classes.dateWrapper}>
                        <Lesson>
                            <Tooltip title={date.SUBTEXT}>
                                <div className={classNames(classes[date.TYPE], classes.dateText)}>{date.TEXT}</div>
                            </Tooltip>
                        </Lesson>
                    </div>
                    <div style={{ width: date.rightSpan * 20 + '%' }} />
                </React.Fragment>
            ))}
        </div>
    );
};

export default withStyles(styles)(Dates);
