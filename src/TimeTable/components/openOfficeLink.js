import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';

class OpenOfficeLink extends React.Component {
    state = {
        webTimer: undefined,
        useUrl: false,
    };
    iframe = React.createRef();

    openUrl = () => {
        window.open(this.props.url.web, '_blank');
    };

    openClient = () => {
        window.addEventListener('blur', this.successClient);
        if (['Win32', 'MacIntel'].indexOf(navigator.platform) >= 0) {
            this.iframe.current.src = this.props.url.client;
        } else {
            this.openUrl();
        }

        let timer = setTimeout(this.errorClient, 6000);
        this.setState({ webTimer: timer });
    };

    errorClient = () => {
        this.iframe.current.src = '';
        this.setState({ webTimer: undefined, useUrl: true });
    };

    successClient = () => {
        clearTimeout(this.state.webTimer);
        this.setState({ webTimer: undefined });
        window.removeEventListener('blur', this.successClient);
        this.iframe.current.src = '';
        this.props.onClick && this.props.onClick();
    };

    componentWillUnmount = () => {
        this.successClient();
    };

    render() {
        const { url, icon, button, dense } = this.props;
        const list = button === undefined || button === false;
        const Comp = list ? ListItem : Button;
        return (
            <React.Fragment>
                <iframe style={{ display: 'none' }} title="openframe" ref={this.iframe} />
                <Comp
                    onClick={this.state.useUrl ? this.openUrl : this.openClient}
                    disabled={!url || !!this.state.webTimer}
                    variant={button && 'contained'}
                    button={true}
                    dense={dense}
                >
                    {list && (
                        <ListItemIcon>
                            {!url || this.state.webTimer ? <CircularProgress size={24} /> : icon}
                        </ListItemIcon>
                    )}
                    {this.props.children}
                </Comp>
            </React.Fragment>
        );
    }
}

export default OpenOfficeLink;
