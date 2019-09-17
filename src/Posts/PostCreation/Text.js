/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';

import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';

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
import editorStyles from './editorStyles.module.css';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import 'draft-js/dist/Draft.css';

const toolbarPlugin = createToolbarPlugin();
const linkifyPlugin = createLinkifyPlugin();
const { Toolbar } = toolbarPlugin;
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [toolbarPlugin, emojiPlugin, linkifyPlugin];
const text = 'Hier den Text eingeben. Auch Smileys sind möglich 🙈';

export default class CustomToolbarEditor extends Component {
    state = {
        editorState: createEditorStateWithText(text),
    };

    componentDidMount() {
        this.focus();
    }

    onChange = editorState => {
        this.setState({
            editorState,
        });
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
