/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
} from 'draft-js-buttons';
import 'draft-js/dist/Draft.css';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import editorStyles from './editorStyles.module.css';

const toolbarPlugin = createToolbarPlugin();
const linkifyPlugin = createLinkifyPlugin();
const emojiPlugin = createEmojiPlugin();
const { Toolbar } = toolbarPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [toolbarPlugin, emojiPlugin, linkifyPlugin];
const text = 'Hier den Text eingeben. Oben findest du die Toolbar. Auch Smileys sind möglich 🙈. Gib dazu ein : ein.';

export default class CustomEditor extends Component {
    state = {
        editorState: this.props.content || createEditorStateWithText(text),
    };

    componentDidMount() {
        this.focus();
    }

    onChange = editorState => {
        this.setState({
            editorState,
        });
        this.props.onChange && this.props.onChange(this.state.editorState);
    };

    focus = () => {
        this.editor.focus();
    };

    render() {
        return (
            <div>
                <div className={editorStyles.editor} onClick={this.focus}>
                    <Editor
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        plugins={plugins}
                        ref={element => {
                            this.editor = element;
                        }}
                        readOnly={this.props.readOnly}
                    />
                    <EmojiSuggestions />
                    <Toolbar>
                        {// may be use React.Fragment instead of div to improve perfomance after React 16
                        externalProps => (
                            <div>
                                <BoldButton {...externalProps} />
                                <ItalicButton {...externalProps} />
                                <UnderlineButton {...externalProps} />
                                <CodeButton {...externalProps} />
                                <Separator {...externalProps} />
                                <HeadlineOneButton {...externalProps} />
                                <HeadlineTwoButton {...externalProps} />
                                <HeadlineThreeButton {...externalProps} />
                                <UnorderedListButton {...externalProps} />
                                <OrderedListButton {...externalProps} />
                                <BlockquoteButton {...externalProps} />
                                <CodeBlockButton {...externalProps} />
                                <EmojiSelect {...externalProps} />
                            </div>
                        )}
                    </Toolbar>
                </div>
            </div>
        );
    }
}
