import React from 'react';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { getTeamsWebUrl, getTeamsNotebook } from '../../Main/actions';
import Icons from '../../Common/Waffle/office-icons';


const styles = theme => ({
    button: {
        justifyContent: 'space-between',
        margin: theme.spacing.unit,
    }
});

class OpenTeamsButton extends React.Component {
    constructor(props) {
        super(props);
        if(props.type === "teams" && !props.url) {
            props.getTeamsWebUrl(props.id);
        }
        if(props.type === "notebook" && !props.url) {
            props.getTeamsNotebook(props.id);
        }
    }

    state={webTimer: undefined};
    iframe = React.createRef();

    openUrl = () => {
        window.open(this.props.url.web, '_blank');
    }

    openClient = () => {
        window.addEventListener("blur", this.successClient);
        if(navigator.platform === "Win32") {
            this.iframe.current.src = this.props.url.client;
        } else {
            this.openUrl();
        }

        let timer = setTimeout(this.errorClient, 6000);
        this.setState({webTimer: timer})
    }

    errorClient = () => {
        this.iframe.current.src = "";
        this.setState({webTimer: undefined, url: true});
    }

    successClient = () => {
        clearTimeout(this.state.webTimer);
        this.setState({webTimer: undefined});
        window.removeEventListener("blur", this.successClient);
        this.iframe.current.src = "";
    }

    componentWillUnmount = () => {
        this.successClient();
    }

    render() {
        const Icon = {
            teams: Icons.Teams,
            notebook: Icons.OneNote
        }[this.props.type];
        const text = {
            teams: "Team öffnen",
            notebook: "Notizbuch öffnen"
        }[this.props.type];
        const {url} = this.props;
        return <React.Fragment>
                <iframe style={{display:'none'}} title="openframe" ref={this.iframe} />
                <ListItem
                    onClick={this.state.url ? this.openUrl : this.openClient} 
                    disabled={!url || !!this.state.webTimer}
                    button
                >
                    <ListItemIcon>
                        {(!url || this.state.webTimer)
                        ? <CircularProgress size={24}/>
                        : <Icon.icon />}
                    </ListItemIcon>
                    <ListItemText primary={this.state.url ? "im Browser öffnen" : text}/>
                </ListItem>
            </React.Fragment>
    }    
}

export default connect(({teams}, {id, type}) => ({
    url: {
            teams: teams.teamUrls && teams.teamUrls[id],
            notebook: teams.notebookUrls && teams.notebookUrls[id],
        }[type]
}), (dispatch) => ({
    getTeamsWebUrl: (id) => dispatch(getTeamsWebUrl(id)),
    getTeamsNotebook: (id) => dispatch(getTeamsNotebook(id)) 
}))(withStyles(styles)(OpenTeamsButton));