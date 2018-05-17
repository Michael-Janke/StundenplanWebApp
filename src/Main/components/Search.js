import React from 'react';
import { withStyles, IconButton, Input, Zoom } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import indigo from '@material-ui/core/colors/indigo';


class Search extends React.Component {
    state = { open: false };

    handleOpen = () => {
        this.setState({ open: !this.state.open });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.searchbar + (!this.state.open ? " " + classes.searchbarClosed : "")}>
                    <div className={classes.inputField + (this.state.open ? " " + classes.inputFieldOpen : "")}>
                        <Input
                            placeholder="Suchen"  
                            fullWidth
                            disableUnderline
                        />
                    </div>
                    <IconButton onClick={this.handleOpen} className={classes.searchIcon + (this.state.open ? " " + classes.searchIconActive : "")}>
                        <SearchIcon />
                    </IconButton>
                </div>
                <div>
                    <div className={classes.children + (this.state.open ? " " + classes.childrenOpen : "")}>
                        {React.Children.map(this.props.children, child => {
                            if (!child) return;
                            return (
                                <Zoom in={!this.state.open}>
                                    <div>
                                        {child}
                                    </div>
                                </Zoom>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

const styles = theme => ({
    searchIcon: {
        color: 'white',
        transition: 'color 400ms',
    },
    searchIconActive: {
        color: 'rgb(158, 158, 158)',
    },
    root: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',

    },
    rootClosed: {

    },
    searchbar: {
        width: '100%',
        transition: 'all 400ms',
        boxShadow: theme.shadows[2],
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
        transition: 'all 400ms',
        height: '100%',
        padding: `${theme.spacing.unit}px ${theme.spacing.unit*2}px`,
    },
    inputFieldOpen: {
        width: '100%',
        opacity: 1,
    },
    children: {
        display: 'flex',
        width: '100%',
        transition: 'width 400ms',
    },
});

export default withStyles(styles)(Search);