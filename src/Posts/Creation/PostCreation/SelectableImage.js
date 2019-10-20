import React from 'react';
import withStyles from '@material-ui/styles/withStyles';
import classNames from 'classnames';

const styles = {
    img: {
        height: '100%',
        objectFit: 'auto',
        display: 'block',
        width: '100%',
    },

    root: {
        position: 'relative',
        width: '100%',
    },

    text: {
        color: '#fff',
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
    },

    hover: {
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '100%',
        opacity: 0,
        transition: '.5s ease',
        backgroundColor: 'rgba(0,0,0,0.5)',
        '&:hover': {
            opacity: 1,
        },
    },
};

const Image = ({ classes, className, src, alt, onClick, children }) => (
    <div className={classNames(classes.root, className)} onClick={onClick}>
        <img className={classes.img} src={src} alt={alt}></img>
        <div className={classes.hover}>
            <div className={classes.text}>{children}</div>
        </div>
    </div>
);

export default withStyles(styles, { withTheme: true })(Image);
