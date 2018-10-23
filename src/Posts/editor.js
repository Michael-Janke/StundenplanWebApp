import React, { Component } from 'react';
import { Dialog, DialogContent, DialogTitle, withStyles, DialogActions, Button, FormControl, InputLabel, Input, Tabs, Tab } from '@material-ui/core';
import { connect } from 'react-redux';
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import CreateIcon from '@material-ui/icons/Create';
import ImageIcon from '@material-ui/icons/Image';
import CollectionsIcon from '@material-ui/icons/Collections';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MUIToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import moment from 'moment';
import SwipeableViews from 'react-swipeable-views';
import EmojiPicker from './emojiPicker';


const styles = theme => ({
    textArea: {
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing.unit,
    },
    formControl: {
        padding: theme.spacing.unit,
        minWidth: 140,
        width: '100%',
        boxSizing: 'border-box',
    },
    dialog: {
        padding: 0,
    }
});

function handleChange(props) {
    return (e) => {
        e.preventDefault();
        props.onChange(e, props.value);
    };
}

const ToggleButton = (props) => (
    <MUIToggleButton onMouseDown={handleChange(props)} {...props} onClick={null} />
);


class PostEditor extends Component {

    state = { open: false, editorState: EditorState.createEmpty(), currentTab: 0 };
    static getDerivedStateFromProps(props, state) {
        if (!state.open && props.open) {
            const post = props.post;
            return {
                open: true,
                DATE_FROM: moment().format(),
                DATE_TO: moment().format(),
                TITLE: "",
                ...post,
                editorState: post ?
                    EditorState.createWithContent(convertFromRaw(JSON.parse(post.TEXT)))
                    : EditorState.createEmpty(),
            }
        }
        return state;
    }
    handleClose = (abort = false) => () => {
        this.setState({
            open: false
        });
        this.props.onClose(abort ? undefined : {
            ...this.props.post,
            TEXT: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
            TITLE: this.state.TITLE,
            DATE_FROM: this.state.DATE_FROM,
            DATE_TO: this.state.DATE_TO,
        });
    }

    handleEditorStateChanged = (state) => {
        this.setState({ editorState: state });
    }

    handleChange = key => (event) => {
        this.setState({ [key]: event.target.value });
    }

    handleFormat = (e, formats) => {
        this.handleEditorStateChanged(RichUtils.toggleInlineStyle(this.state.editorState, formats));
    }

    handleEmojiDropDown = (e) => {
        e.preventDefault();
    }

    handleTabChange = (event, value) => {
        this.setState({ currentTab: value });
    };

    handleChangeIndex = index => {
        this.setState({ currentTab: index });
    };

    render() {
        const { small, contribution, classes } = this.props;
        const inlineStyle = [...this.state.editorState.getCurrentInlineStyle()];

        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleClose(true)}
                fullScreen={small}
                className={classes.dialog}
                fullWidth
                maxWidth={false}
            >
                <DialogTitle>
                    {"Beitrag " + (contribution ? "editieren" : "hinzufügen")}
                </DialogTitle>
                <DialogContent>
                    <Tabs
                        value={this.state.currentTab}
                        onChange={this.handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                    >
                        <Tab label="Schreiben" icon={<CreateIcon />} />
                        <Tab disabled label="Bild" icon={<ImageIcon />} />
                        <Tab disabled label="Diashow" icon={<CollectionsIcon />} />
                    </Tabs>
                    <SwipeableViews
                        index={this.state.currentTab}
                        onChangeIndex={this.handleChangeIndex}
                    >
                        <div>
                            <FormControl className={classes.formControl} error={!this.state.TITLE}>
                                <InputLabel htmlFor="title">Titel</InputLabel>
                                <Input
                                    id="title"
                                    name="text"
                                    fullWidth
                                    value={this.state.TITLE}
                                    onChange={this.handleChange("TITLE")}
                                />
                            </FormControl>
                            <ToggleButtonGroup exclusive value={inlineStyle} onChange={this.handleFormat}>
                                <ToggleButton value="BOLD">
                                    <FormatBoldIcon />
                                </ToggleButton>
                                <ToggleButton value="ITALIC">
                                    <FormatItalicIcon />
                                </ToggleButton>
                                <ToggleButton value="UNDERLINE">
                                    <FormatUnderlinedIcon />
                                </ToggleButton>
                                <ToggleButton disabled value="COLOR">
                                    <FormatColorFillIcon />
                                    <ArrowDropDownIcon />
                                </ToggleButton>
                                <EmojiPicker />
                            </ToggleButtonGroup>
                            <div className={classes.textArea} onClick={this.refs.editor && this.refs.editor.focus}>
                                <Editor
                                    ref="editor"
                                    editorState={this.state.editorState}
                                    onChange={this.handleEditorStateChanged}
                                />
                            </div>
                        </div>
                        <div></div>
                        <div></div>
                    </SwipeableViews>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={this.handleClose(true)}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={this.handleClose()}
                    >
                        Absenden
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    small: state.browser.lessThan.medium,
})

export default connect(mapStateToProps)(withStyles(styles)(PostEditor));