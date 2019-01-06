import React from 'react';
import { withStyles, IconButton } from '@material-ui/core';
import gray from '@material-ui/core/colors/grey';
import AddIcon from '@material-ui/icons/Add';


const styles = theme => ({
    root: {
        backgroundColor: gray[200],
        position: 'relative',
        width: '100%',
        paddingTop: '56.5%',

    },
    buttonAdd: {
        border: `3px dashed ${gray[600]}`,
        borderRadius: '50%',
        padding: theme.spacing.unit * 3,
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        display: 'none',
    },
    img: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

class ImageEditor extends React.Component {

    state = {  };


    static getDerivedStateFromProps(props, state) {
        if (props.image !== state.image) {
            return {
                image: props.image,
                src: null,
                alt: null,
                ...props.image
            }
        }
        return null;
    }

    handleChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.setState({ img: reader.result });
            if (this.props.onImageEdit) {
                this.props.onImageEdit({ src: reader.result, alt: "" });
            }
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <img src={this.state.src} alt="" className={classes.img} />

                <div className={classes.container}>
                    <label htmlFor="flat-button-file">
                        <IconButton component="span" className={classes.buttonAdd}>
                            <AddIcon fontSize="large"></AddIcon>
                        </IconButton>
                    </label>

                    <input
                        accept="image/*"
                        className={classes.input}
                        id="flat-button-file"
                        multiple
                        type="file"
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ImageEditor);