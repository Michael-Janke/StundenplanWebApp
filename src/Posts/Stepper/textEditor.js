import React, { Component } from 'react';
import { withStyles, FormControl, InputLabel, Input, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw, Modifier } from 'draft-js';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import MUIToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import EmojiPicker from './emojiPicker';
import ColorPicker from './colorPicker';
import { COLOR_STYLE_MAP } from '../../Common/const';


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

    state = { editorState: EditorState.createEmpty() };
    static getDerivedStateFromProps(props, state) {
        const post = props.post;
        if (post !== state.post && post.TYPE) {
            return {
                post,
                TITLE: post.TITLE,
                editorState: post.TEXT ?
                    EditorState.createWithContent(convertFromRaw(JSON.parse(post.TEXT)))
                    : EditorState.createEmpty(),
            }
        }
        return state;
    }

    componentDidMount() {
        this.props.handleNextFunction(this.handleNext);
    }

    handleNext = () => {
        const prevPost = this.props.post;
        return {
            ...prevPost,
            TEXT: JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
            TITLE: this.state.TITLE,
        };
    }

    handleEmojiSelected = (emoji) => {
        const editorState = this.state.editorState;
        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const ncs = Modifier.replaceText(contentState, selection, emoji);
        const es = EditorState.push(editorState, ncs, 'insert-fragment');
        this.handleEditorStateChanged(es);
    }

    handleColorSelected = (toggledColor) => {
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        // Let's just allow one color at a time. Turn off all active colors.
        const nextContentState = Object.keys(COLOR_STYLE_MAP)
            .reduce((contentState, color) => {
                return Modifier.removeInlineStyle(contentState, selection, color)
            }, editorState.getCurrentContent());
        let nextEditorState = EditorState.push(
            editorState,
            nextContentState,
            'change-inline-style'
        );
        const currentStyle = editorState.getCurrentInlineStyle();
        // Unset style override for current color.
        if (selection.isCollapsed()) {
            nextEditorState = currentStyle.reduce((state, color) => {
                return RichUtils.toggleInlineStyle(state, color);
            }, nextEditorState);
        }
        // If the color is being toggled on, apply it.
        if (!currentStyle.has(toggledColor)) {
            nextEditorState = RichUtils.toggleInlineStyle(
                nextEditorState,
                toggledColor
            );
        }
        this.handleEditorStateChanged(nextEditorState);
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

    render() {
        const { classes } = this.props;
        const inlineStyle = [...this.state.editorState.getCurrentInlineStyle()];

        return (
            <>
                <Typography>
                    Schreibe deinen Text
                </Typography>
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
                    <ColorPicker value={inlineStyle} onColorSelected={this.handleColorSelected} />
                    <EmojiPicker onEmojiSelected={this.handleEmojiSelected} />
                </ToggleButtonGroup>
                <div className={classes.textArea} onClick={this.refs.editor && this.refs.editor.focus}>
                    <Editor
                        ref="editor"
                        editorState={this.state.editorState}
                        customStyleMap={COLOR_STYLE_MAP}
                        onChange={this.handleEditorStateChanged}
                    />
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    small: state.browser.lessThan.medium,
})

export default connect(mapStateToProps)(withStyles(styles)(PostEditor));