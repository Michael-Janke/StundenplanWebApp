import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getTeamsWebUrl } from '../../Main/actions';
import Icons from '../../Common/Waffle/office-icons';

class OpenTeamsButton extends React.Component {
    state={loading: false};
    openTeam = () => {
        this.props.onClick && this.props.onClick();
        if(!this.props.webUrl) {
            this.props.getTeamsWebUrl(this.props.id);
            this.setState({loading:true});
        } else {
            this.openLink();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.webUrl !== this.props.webUrl
            && this.state.loading) {
                this.setState({loading: false});
                this.openLink();
            }
    }
    openLink() {
        window.open(this.props.webUrl, "_blank");
    }
    render() {
        return <Button variant="outlined" onClick={this.openTeam}>
                    {this.state.loading 
                    ?  <CircularProgress style={{marginRight: 10}} size={24}/>
                    : <Icons.Teams.icon style={{marginRight: 10}}/>} 
                    Team öffnen
                </Button>
    }    
}

export default connect(({teams}, {id}) => ({
    webUrl: teams.webUrls[id]
}), (dispatch) => ({
    getTeamsWebUrl: (id) => dispatch(getTeamsWebUrl(id)) 
}))(OpenTeamsButton);