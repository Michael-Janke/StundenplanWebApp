import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import grey from '@material-ui/core/colors/grey';
import { ReactComponent as PhotoIcon } from './Icons/photo.svg';
import { ReactComponent as StockPhotoIcon } from './Icons/stockphoto.svg';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        textAlign: 'center',
    },
    modeButton: {
        borderColor: grey[400],
        backgroundColor: grey[100],
        borderRadius: 0,
        borderWidth: 1,
        borderStyle: 'solid',
        padding: theme.spacing(4),
        '&:hover': {
            backgroundColor: grey[200],
        },
        width: 300,
    },
    focusVisible: {
        backgroundColor: grey[300],
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        width: '100%',
    },
});

const PhotoModeSelector = ({ classes, onPhotoModeSelect }) => (
    <div className={classes.root}>
        <Typography>
            Mache deinen Beitrag mit einem Bild schön! Lade entweder ein selbstfotografiertes Bild hoch oder wähle eins
            aus tausenden Stockfotos aus!
        </Typography>
        <div className={classes.buttons}>
            <ButtonBase
                focusRipple
                className={classes.modeButton}
                focusVisibleClassName={classes.focusVisible}
                onClick={() => onPhotoModeSelect('upload')}
            >
                <Typography>
                    <PhotoIcon />
                    Eigenes Foto hochladen
                </Typography>
            </ButtonBase>
            <ButtonBase
                focusRipple
                className={classes.modeButton}
                focusVisibleClassName={classes.focusVisible}
                onClick={() => onPhotoModeSelect('stock')}
            >
                <Typography>
                    <StockPhotoIcon />
                    Stockfoto auswählen
                </Typography>
            </ButtonBase>
        </div>
        <Button onClick={() => onPhotoModeSelect('no')}>Kein Foto</Button>
    </div>
);

export default withStyles(styles, { withTheme: true })(PhotoModeSelector);
