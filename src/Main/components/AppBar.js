import React from 'react';
import Search from './Search.js';
import { useSelector } from 'react-redux';

import UnreadMessages from './UnreadMessages';
import PrintButton from './PrintButton';
import makeStyles from '@material-ui/styles/makeStyles';

const useStyles = makeStyles({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
});

const AppBar = ({ children }) => {
    const classes = useStyles();
    const small = useSelector((state) => state.browser.lessThan.medium);
    const large = useSelector((state) => state.browser.greaterThan.medium);
    return (
        <div className={classes.root} style={{ marginLeft: large ? 'calc(50% - 494px)' : undefined }}>
            <Search shrinkChildren={small} alwaysOpen={!small}>
                {!small && <PrintButton />}
                <UnreadMessages />
                {children}
            </Search>
        </div>
    );
};

export default AppBar;
