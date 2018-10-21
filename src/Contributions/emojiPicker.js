import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';

import EmojiconIcon from '@material-ui/icons/Face';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Popover, Grid, Button, withStyles } from '@material-ui/core';

const styles = theme => ({
    grid: {
        width: (64) * 3,
        maxHeight: 64 * 3,

    },
    button: {
        fontSize: '100%',
    }
});

class EmojiPicker extends React.Component {

    state = {
        anchorEl: null,
        emojis: null,
    };

    componentDidUpdate() {
        if(this.state.anchorEl && !this.state.emojis)
            import("./emojis.json").then(data => this.setState({ emojis: data.emojis }));
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const { classes } = this.props;
        return (
            <React.Fragment>
                <ToggleButton onMouseDown={this.handleClick}>
                    <EmojiconIcon />
                    <ArrowDropDownIcon />
                </ToggleButton>
                <Popover
                    id="simple-popper"
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <Grid container spacing={0} className={classes.grid}>
                        {this.state.emojis && Object.values(this.state.emojis).map((entry, i) => {
                            let emoji = String.fromCodePoint(entry.u.split('-').reduce((sum, n) => sum + parseInt("0x" + n), 0));
                            return <Grid item xs={4} zeroMinWidth key={i}>
                                <Button className={classes.button}>
                                    <span role="img" aria-label="lol">{emoji}</span>
                                </Button>
                            </Grid>
                        })}

                    </Grid>
                </Popover>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(EmojiPicker);