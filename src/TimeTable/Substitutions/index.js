import React from 'react';
import makeGetSubstitutions from '../../Selector/substitution';
import { connect } from 'react-redux';
import { getSubstitutions } from '../../Main/actions';
import moment from 'moment';

class Substitutions extends React.Component {

    constructor(props) {
        super(props);
        if (!props.substitutions) {
            props.getSubstitutions(moment().week(), moment().year());
        }
    }

    render() {
        console.log(this.props.substitutions);
        return (
            <div>
                substitution

            </div>
        );
    }
}

const makeStateToProps = () => {
    const getSubstitutions = makeGetSubstitutions();
    return (state) => ({
        substitutions: getSubstitutions(state),
        masterdata: state.masterdata,
    });
}
const mapDispatchToProps = (dispatch) => ({
    getSubstitutions: (week, year) => {
        dispatch(getSubstitutions(0, 'all', week, year));
    }
});

export default connect(makeStateToProps, mapDispatchToProps)(Substitutions);