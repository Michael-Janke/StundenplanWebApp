import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { createPortal } from 'react-dom';
import TimeTableContainer from '../components/container';

class Frame extends React.Component {
    constructor(props) {
        super(props)

        this.setContentRef = node => {
            this.contentRef = node ? node.contentWindow.document : null;
            if (this.props.innerRef) {
                this.props.innerRef(node);
            }
        }
    }

    render() {
        const { children, innerRef, ...props } = this.props;
        return (
            <iframe title="no" {...props} ref={this.setContentRef}>
                {this.contentRef && React.Children.map(children, child =>
                    this.contentRef[child.type] &&
                    createPortal(child.props.children, this.contentRef[child.type])
                )}
            </iframe>
        )
    }
}
const styles = ({
    layout: {
        backgroundColor: 'white',
        padding: 8,
        pointerEvents: 'none',
    },
    page: {
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
    },
    frame: {
        border: 'none',
        margin: 0,
        display: 'none',
    }
})

class Page extends React.Component {
    state = {};

    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.open) {
            return false;
        }
        return this.props.horizontal !== nextProps.horizontal
            || this.props.substitutions !== nextProps.substitutions
            || this.props.openPrint !== nextProps.openPrint
            || this.props.exact !== nextProps.exact
            || this.state.pageStyles !== nextState.pageStyles;
    };


    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    componentDidUpdate(prevProps) {
        if (this.props.horizontal !== prevProps.horizontal
            || this.props.substitutions !== prevProps.substitutions
            || this.props.exact !== prevProps.exact) {
            this.handleResize();
        }
        if (this.props.openPrint !== prevProps.openPrint && this.props.openPrint) {
            this.frameRef.contentWindow.print();
            this.props.onPrintClose();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = (event) => {
        if (!this.refs.page) {
            return;
        }
        const { horizontal } = this.props;
        const clientWidth = this.refs.page.clientWidth;
        const height = clientWidth * (horizontal ? 1 / Math.sqrt(2) : Math.sqrt(2));
        this.setState({
            pageStyles: { height },
            frameStyles: { display: 'block' },
            globalStyles: this.renderStyles(),
        });
    }

    toArray(object) {
        let newChildren = [];
        for (let i = 0; i < object.length; i++) {
            newChildren[i] = object[i];
        }
        return newChildren;
    }

    renderStyles() {
        const head = document.getElementsByTagName('head')[0];
        const children = this.toArray(head.children);

        const getAttributes = (child) => {
            const obj = {};
            for (let i = 0; i < child.attributes.length; i++) {
                const attr = child.attributes[i];
                obj[attr.nodeName] = attr.nodeValue;
            }
            return obj;
        }
        const mapCssRules = (child) => {
            const css = this.toArray(child.sheet.cssRules);
            return css.map(rule => rule.cssText).join("\n");
        }

        const styles = children
            .filter(child => child.tagName === 'STYLE')
            .map(child =>
                <style key={child.getAttribute('data-meta') + child.innerHTML.length} {...getAttributes(child)}>
                    {child.innerHTML || mapCssRules(child)}
                </style>
            );
        return styles;
    }

    handleFrameRef = ref => {
        this.frameRef = ref;
    }

    render() {
        const { pageStyles, frameStyles, globalStyles } = this.state;
        const { classes, horizontal, exact } = this.props;
        return (
            <div className={classes.layout}>
                <div ref="page" className={classes.page} style={pageStyles}>
                    <Frame innerRef={this.handleFrameRef} style={frameStyles} width="100%" height="100%" className={classes.frame}>
                        <head>{globalStyles}</head>
                        <body>
                            <div style={{ height: 0 }}>
                                <TimeTableContainer
                                    {...(!this.props.substitutions && { date: null, noSubstitutions: true })}
                                    print
                                    small={false}
                                />
                            </div>

                            <style type="text/css">
                                {`body * {
                                    ${exact ? `
                                        background-image: none!important;
                                        background-color: transparent!important;`
                                        : ""}
                                    transition: background-image 250ms, background-color 250ms;
                                }`}
                            </style>

                            <style type="text/css" media="print">
                                {`@page {
                                    size: ${horizontal ? 'landscape' : 'portrait'}; 
                                }
                                body {
                                    -webkit-print-color-adjust: ${exact ? 'exact' : 'economy'};    
                                }`}
                            </style>
                        </body>
                    </Frame>
                </div>
            </div>
        )
    }
}



export default withStyles(styles)(Page);