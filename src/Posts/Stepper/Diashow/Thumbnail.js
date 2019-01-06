import React from 'react';
import { withStyles, ButtonBase } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import gray from '@material-ui/core/colors/grey';

const styles = theme => ({
    button: {

    },
    root: {
        width: 124 * 16 / 9,
        height: 124,
        padding: theme.spacing.unit,
        border: `3px solid ${theme.palette.divider}`,
        overflow: 'hidden',
    },
    buttonAdd: {
        border: `3px dashed ${gray[600]}`,
        borderRadius: '50%',
        padding: theme.spacing.unit * 1,
    },
});

function Thumbnail({ classes, image, onClick }) {
    const src = image ? image.src:null;
    const alt = image ? image.alt:null;
    return (
        <ButtonBase className={classes.root} onClick={onClick}>
            <div className={classes.button}>
                {src ? <img
                    src={src}
                    alt={alt}
                    height=""
                    width="100%"
                ></img>
                    :
                    <div className={classes.buttonAdd}>
                        <AddIcon fontSize="large" color="action"></AddIcon>
                    </div>
                }
            </div>
        </ButtonBase>
    );
}

export default withStyles(styles)(Thumbnail);
