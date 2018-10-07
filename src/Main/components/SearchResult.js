import React from 'react';
import { checkAvatars } from './Avatars';
import { connect } from 'react-redux';
import { loadAvatars } from '../actions';
import makeGetEffectiveAvatars from '../../Selector/avatars';
import List from '@material-ui/core/List';
import { RootRef } from '@material-ui/core';

const growthFactor = 18;

class SearchResult extends React.PureComponent {
    state = {};
    static getResults(props, start, end) {
        const results = props.results.slice(start, end);
        checkAvatars(
            results.map((e) => e.upn),
            props.loadAvatars
        );
        return results;
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.open || !props.results) {
            // do nothing if closing
            return { open: props.open };
        }
        const resultChanged = (
            props.results && state.results
            && !props.results.every((v, i) => (state.results[i] || {}).id === v.id)
        ) || props.open !== state.open;

        return {
            open: props.open,
            results: props.results,
            resultChanged: resultChanged,
            elements: (props.results !== state.results) ?
                SearchResult.getResults(props, 0, !resultChanged && state.elements ? state.elements.length : growthFactor) : state.elements,
        }
    }
    componentDidUpdate(prevState, prevProps) {
        if (this.state.resultChanged) {
            this.scroll.scrollTop = 0;
        }
        this.onScroll();
    }

    onScroll = () => {
        if (!this.state.elements || !this.state.open) {
            return;
        }
        if (this.scroll.scrollTop + this.scroll.clientHeight >=
            (this.scroll.scrollHeight || this.scroll.clientHeight) - 20) {
            if (this.props.results.length > this.state.elements.length) {
                this.setState({
                    elements: SearchResult.getResults(this.props, 0, this.state.elements.length + growthFactor)
                });
            }
        }
    }

    handleRef = (ref) => {
        this.scroll = ref;
        this.scroll.addEventListener("scroll", this.onScroll);
    }


    componentWillUnmount() {
        this.scroll.removeEventListener("scroll", this.onScroll);
    }

    render() {

        const { className } = this.props;
        return (
            this.state.elements ?
                <RootRef rootRef={this.handleRef}>
                    <List component="div" className={className}>
                        {this.props.filterBar}
                        {this.props.children(this.state.elements, this.props.avatars)}
                    </List>
                </RootRef>
                : null
        )
    }
}

const makeMapStateToProps = () => {
    const getEffectiveAvatars = makeGetEffectiveAvatars();
    return (state) => ({
        avatars: getEffectiveAvatars(state),
    });
}

const mapDispatchToProps = dispatch => ({
    loadAvatars: (upns) => { dispatch(loadAvatars(upns)); },
});


export default connect(makeMapStateToProps, mapDispatchToProps)(SearchResult);