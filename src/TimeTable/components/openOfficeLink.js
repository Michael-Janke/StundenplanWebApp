import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemIcon from '@material-ui/core/ListItemIcon';

class OpenOfficeLink extends React.Component {
    state = { webTimer: undefined };
    iframe = React.createRef();

    openUrl = () => {
        window.open(this.props.url.web, '_blank');
    };

    openClient = () => {
        window.addEventListener('blur', this.successClient);
        if (navigator.platform === 'Win32') {
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
    };

    componentWillUnmount = () => {
        this.successClient();
    };

    render() {
        const { url, icon } = this.props;
        return (
            <React.Fragment>
                <iframe style={{ display: 'none' }} title="openframe" ref={this.iframe} />
                <ListItem
                    onClick={this.state.useUrl ? this.openUrl : this.openClient}
                    disabled={!url || !!this.state.webTimer}
                    button
                >
                    <ListItemIcon>{!url || this.state.webTimer ? <CircularProgress size={24} /> : icon}</ListItemIcon>
                    {this.props.children}
                </ListItem>
            </React.Fragment>
        );
    }
}

export default OpenOfficeLink;
