import React from 'react';
import { connect } from 'react-redux';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

import { getTeamsWebUrl, getTeamsNotebook } from '../../Main/actions';
import Icons from '../../Common/Waffle/office-icons';
import OpenOfficeButton from './openOfficeLink';

const styles = theme => ({
    button: {
        justifyContent: 'space-between',
        margin: theme.spacing.unit,
    },
});

class OfficeLink extends React.Component {
    constructor(props) {
        super(props);
        if (props.type === 'teams' && !props.url) {
            props.getTeamsWebUrl(props.id);
        }
        if (props.type === 'notebook' && !props.url) {
            props.getTeamsNotebook(props.id);
        }
    }

    render() {
        const { url } = this.props;
        const Icon = {
            teams: Icons.Teams,
            notebook: Icons.OneNote,
        }[this.props.type];
        const text = {
            teams: 'Team öffnen',
            notebook: 'Notizbuch öffnen',
        }[this.props.type];
        return (
            <OpenOfficeButton url={url} icon={<Icon.icon />}>
                <ListItemText primary={text} />
            </OpenOfficeButton>
        );
    }
}

export default connect(
    ({ teams }, { id, type }) => ({
        url: {
            teams: teams.teamUrls && teams.teamUrls[id],
            notebook: teams.notebookUrls && teams.notebookUrls[id],
        }[type],
    }),
    dispatch => ({
        getTeamsWebUrl: id => dispatch(getTeamsWebUrl(id)),
        getTeamsNotebook: id => dispatch(getTeamsNotebook(id)),
    })
)(withStyles(styles)(OfficeLink));
