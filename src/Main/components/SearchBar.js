import React, { useRef, useEffect } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import makeStyles from '@material-ui/styles/makeStyles';
import indigo from '@material-ui/core/colors/indigo';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
    icon: {
        transition: theme.transitions.create(['transform']),
        WebkitTransition: theme.transitions.create(['transform']),
        color: 'rgb(158, 158, 158)',
        transform: 'scale(1,1)',
    },

    searchbar: {
        width: '100%',
        transform: 'translate3d(0,0,0)',
        transition: theme.transitions.create(['background', 'box-shadow']),
        WebkitTransition: theme.transitions.create(['background', 'box-shadow']),
        willChange: 'background, box-shadow',
        boxShadow: theme.shadows[4],
        borderRadius: 2,
        background: `rgb(197, 202, 233) radial-gradient(circle, transparent 1%, ${indigo[600]} 1%) center/15000%;`,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    searchbarClosed: {
        backgroundSize: '100%',
        backgroundColor: indigo[600],
        boxShadow: 'none',
    },

    inputField: {
        width: '0%',
        opacity: 0,
        transition: theme.transitions.create(['width', 'opacity']),
        WebkitTransition: theme.transitions.create(['width', 'opacity']),
        willChange: 'width, opacity',
        height: '100%',
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
    inputFieldOpen: {
        width: '100%',
        opacity: 1,
    },
    nativeInput: {
        width: '100%',
        color: 'rgba(0, 0, 0, 0.87)',
        // remove clear icon on edge
        '&::-ms-clear': {
            display: 'none',
        },
    },
    iconHidden: {
        transform: 'scale(0,0)',
    },
    searchIcon: {
        transitionProperty: 'transform, color',
        WebkitTransitionProperty: 'transform, color',
    },
    searchIconActive: {
        color: 'white',
    },
    closeIcon: {
        marginLeft: -48,
    },
}));

const SearchBar = ({ open, onOpen, value, onChange, onClose }) => {
    const classes = useStyles();
    const inputRef = useRef(null);
    const handleKeyUp = e => {
        if (e.keyCode === 27 || e.key === 'ESC') {
            onClose(false);
        }
        if (e.keyCode === 40 || e.key === 'ArrowDown') {
            onOpen();
        }
    };

    return (
        <div className={classNames(classes.searchbar, { [classes.searchbarClosed]: !open })}>
            <div className={classNames(classes.inputField, { [classes.inputFieldOpen]: open > 0 })}>
                <Input
                    inputRef={inputRef}
                    placeholder="Suchen"
                    fullWidth
                    disableUnderline
                    onFocus={onOpen}
                    onClick={onOpen}
                    onChange={e => onChange(e.target.value)}
                    value={value}
                    inputProps={{
                        className: classes.nativeInput,
                    }}
                    onKeyUp={handleKeyUp}
                />
            </div>
            <IconButton
                onClick={onOpen}
                className={classNames(classes.icon, classes.searchIcon, {
                    [classes.iconHidden]: value.length > 0,
                    [classes.searchIconActive]: !open,
                })}
            >
                <SearchIcon />
            </IconButton>
            <IconButton
                onClick={() => onClose(false)}
                className={classNames(classes.icon, classes.closeIcon, { [classes.iconHidden]: value.length === 0 })}
            >
                <ClearIcon />
            </IconButton>
        </div>
    );
};
export default SearchBar;
