import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Popover, withStyles, Grid, ButtonBase } from '@material-ui/core';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import { COLOR_STYLE_MAP, classNames } from '../../Common/const';

const styles = theme => ({
    grid: {
        width: 48 * 3,
        display: 'flex',
    },
    colorBox: {
        width: 48,
        height: 48,
        borderRadius: '0%',
        transition: theme.transitions.create(['border-radius']),
        '&:hover': {
            borderRadius: '20%',
        },
    },
    colorBoxActive: {
        borderRadius: '50%',
    }
});


class ColorPicker extends React.Component {

    state = {
        anchorEl: null,
    };

    handleClick = event => {
        event.preventDefault();
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleColor = (e, color) => {
        e.preventDefault();
        this.handleClose();
        this.props.onColorSelected(color);
    }

    render() {
        const { anchorEl } = this.state;
        const { classes, value = [] } = this.props;
        const entry = Object.entries(COLOR_STYLE_MAP).find(([name, { color }]) => value.indexOf(name) !== -1);
        const color = entry && entry[1];
        const activeColor = color && color.color;
        return (
            <React.Fragment>
                <ToggleButton selected={!!activeColor} onMouseDown={this.handleClick} value="COLOR">
                    <FormatColorFillIcon style={{ color: activeColor }} />
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
                    <div className={classes.grid}>
                        <Grid container>
                            {Object.entries(COLOR_STYLE_MAP).map(([name, { color }]) => {
                                const isActive = color === activeColor;
                                return (
                                    <Grid item xs={4} key={name}>
                                        <ButtonBase
                                            className={classNames(classes.colorBox, isActive && classes.colorBoxActive)}
                                            style={{ backgroundColor: color }}
                                            onMouseDown={(e) => this.handleColor(e, isActive ? null : name)}>
                                        </ButtonBase>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </div>
                </Popover>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(ColorPicker);