import React from 'react';
import { checkAvatars } from './Avatars';
import { connect } from 'react-redux';
import { loadAvatars } from '../actions';
import makeGetEffectiveAvatars from '../../Selector/avatars';
import List from '@material-ui/core/List';

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
            return {};
        }
        return {
            results: props.results,
            elements: (props.results !== state.results) ?
                SearchResult.getResults(props, 0, 15) : state.elements,
        }
    }
    componentDidUpdate(prevState, prevProps) {
        if (this.props.results !== prevProps.results) {
            this.scroll.scrollTop = 0;
        }
        this.onScroll();
    }

    onScroll = () => {
        if (!this.state.elements) {
            return;
        }
        if (this.scroll.scrollTop + this.scroll.clientHeight >=
            (this.scroll.scrollHeight || this.scroll.clientHeight) - 20) {
            if (this.props.results.length > this.state.elements.length) {
                this.setState({
                    elements: SearchResult.getResults(this.props, 0, this.state.elements.length + 15)
                });
            }
        }
    }

    componentDidMount() {
        this.scroll.addEventListener("scroll", this.onScroll);
    }

    componentWillUnmount() {
        this.scroll.removeEventListener("scroll", this.onScroll);
    }

    render() {
        
        const { className } = this.props;
        return (
            <div ref={node => this.scroll = node} className={className}>
                {this.state.elements &&
                    <List component="div">
                        {this.props.filterBar}
                        {this.props.children(this.state.elements, this.props.avatars)}
                    </List>
                }
            </div>
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