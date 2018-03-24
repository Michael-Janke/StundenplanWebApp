import React, { Component } from "react";
import { connect } from "react-redux";

const ResponsiveFontSize = (props) => {
    const fontSize = {
        extraSmall: 14,
        small: 15,
        medium: 16,
        large: 18,
        infinity: 20
    }[props.mediaType];
    console.log(props.mediaType);
    return (
        <div style={{ fontSize, height: '100%' }}>
            {props.children}
        </div>
    );
}
const mapStateToProps = state => {
    return {
        mediaType: state.browser.mediaType
    };
};


export default connect(mapStateToProps)(ResponsiveFontSize);