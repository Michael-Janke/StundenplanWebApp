import React from 'react';
import { connect } from 'react-redux';

import { getTeamsWebUrl } from '../../Main/actions';
import OpenOfficeButton from './openOfficeLink';

class AssignmentLink extends React.Component {
    constructor(props) {
        super(props);
        props.getTeamsWebUrl(props.id);
    }

    render() {
        const { url, icon, children, getUrl } = this.props;
        if (url) {
            const { web, client } = url;

            var customUrl = { web: getUrl(web), client: getUrl(client) };
        }
        return (
            <OpenOfficeButton url={customUrl} icon={icon}>
                {children}
            </OpenOfficeButton>
        );
    }
}

export default connect(
    ({ teams }, { id, type }) => ({
        url: teams.teamUrls && teams.teamUrls[id],
    }),
    dispatch => ({
        getTeamsWebUrl: id => dispatch(getTeamsWebUrl(id)),
    })
)(AssignmentLink);
