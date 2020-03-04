import React from 'react';
import { connect } from 'react-redux';

import { getTeamsWebUrl } from '../../../../Main/actions';
import OpenOfficeButton from '../Office/OpenOfficeButton';

export function getAssignmentLink(assignment, link) {
    // from Assignment notification bot
    const reg = /team\/(\d+:.*%40thread\.skype)/;
    const match = reg.exec(link);

    const subEntityId = JSON.stringify({
        version: '1.0',
        config: {
            classes: [
                {
                    id: assignment.classId,
                    assignmentIds: [assignment.id],
                },
            ],
        },
        action: 'navigate',
        view: 'assignment-viewer',
    });

    return `${link.substring(
        0,
        match.index
    )}entity/66aeee93-507d-479a-a3ef-8f494af43945/classroom?context=${encodeURIComponent(
        JSON.stringify({
            subEntityId,
            channelId: decodeURIComponent(match[1]),
        })
    )}`;
}
class AssignmentLink extends React.Component {
    constructor(props) {
        super(props);
        props.getTeamsWebUrl(props.id);
    }

    render() {
        const { url, icon, children, assignment, button, onClick } = this.props;
        if (url) {
            const { web, client } = url;

            var customUrl = { web: getAssignmentLink(assignment, web), client: getAssignmentLink(assignment, client) };
        }
        return (
            <OpenOfficeButton url={customUrl} icon={icon} button={button} onClick={onClick}>
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
