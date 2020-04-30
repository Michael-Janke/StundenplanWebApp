import React, { useLayoutEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { createPortal } from 'react-dom';

const useStyles = makeStyles({
    page: {
        overflow: 'auto',
        height: '22cm',
        width: '22cm',
        boxSizing: 'border-box',
        display: 'none',
        background: 'white',
    },
    frame: {
        margin: 0,
        pointerEvents: 'none',
        border: 'none',
        display: 'block',
    },
});

const Page = ({ openPrint, onPrintClose, horizontal, exact, open, children }) => {
    const classes = useStyles();
    const ref = useRef();
    useLayoutEffect(() => {
        if (openPrint) {
            ref.current.contentWindow.print();
            onPrintClose();
        }
    }, [ref.current, openPrint]);

    const renderStyles = () => {
        const toArray = (object) => {
            let newChildren = [];
            for (let i = 0; i < object.length; i++) {
                newChildren[i] = object[i];
            }
            return newChildren;
        };
        const head = document.getElementsByTagName('head')[0];
        const children = toArray(head.children);

        const getAttributes = (child) => {
            const obj = {};
            for (let i = 0; i < child.attributes.length; i++) {
                const attr = child.attributes[i];
                obj[attr.nodeName] = attr.nodeValue;
            }
            return obj;
        };
        const mapCssRules = (child) => {
            const css = toArray(child.sheet.cssRules);
            return css.map((rule) => rule.cssText).join('\n');
        };

        const styles = children
            .filter((child) => child.tagName === 'STYLE')
            .map((child) => (
                <style key={child.getAttribute('data-meta') + child.innerHTML.length} {...getAttributes(child)}>
                    {child.innerHTML || mapCssRules(child)}
                </style>
            ));
        return styles;
    };

    return (
        <div className={classes.page} style={{ display: open ? 'block' : 'none' }}>
            <Frame
                innerRef={ref}
                style={{
                    width: horizontal ? '29.7cm' : '21cm',
                    height: horizontal ? '21cm' : '29.7cm',
                }}
                className={classes.frame}
            >
                <head>{renderStyles()}</head>
                <body>
                    <div>{children}</div>

                    <style type="text/css">
                        {`
                            body * {
                                    ${
                                        exact
                                            ? `
                                        background-image: none!important;
                                        background-color: transparent!important;`
                                            : ''
                                    }
                                    -webkit-print-color-adjust: exact;
                                    transition: background-image 250ms, background-color 250ms;
                                }
                            body {
                                    margin: 20mm;
                            }`}
                    </style>

                    <style type="text/css" media="print">
                        {`   @page {
                                    size: ${horizontal ? '29.7cm 21cm' : '21cm 29.7cm'};
                                    margin: 20mm !important;
                                }
                                body {
                                    -webkit-print-color-adjust: ${exact ? 'exact' : 'economy'};  
                                    margin: 0;
                                }`}
                    </style>
                </body>
            </Frame>
        </div>
    );
};

export default Page;

class Frame extends React.Component {
    setContentRef = (node) => {
        this.contentRef = node ? node.contentWindow.document : null;
        if (this.props.innerRef) {
            this.props.innerRef.current = node;
        }
        this.forceUpdate();
    };

    render() {
        const { children, innerRef, ...props } = this.props;
        return (
            <iframe title="no" {...props} ref={this.setContentRef}>
                {this.contentRef &&
                    React.Children.map(
                        children,
                        (child) =>
                            this.contentRef[child.type] &&
                            createPortal(child.props.children, this.contentRef[child.type])
                    )}
            </iframe>
        );
    }
}
