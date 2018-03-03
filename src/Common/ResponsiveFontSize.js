import React, {Component} from "react";
import {connect} from "react-redux";

class ResponsiveFontSize extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username || '',
            password: ''
        };
        this.login = () => props.login(this.state.username, this.state.password);
    }

    render() {
        const fontSize = {
            extraSmall: 14,
            small: 15,
            medium: 16,
            large: 18,
            infinity: 20
        }[this.props.mediaType];
        console.log(this.props.mediaType);
        return (
            <div style={{fontSize, height: '100%'}}>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        mediaType: state.browser.mediaType
    };
};


export default connect(mapStateToProps)(ResponsiveFontSize);