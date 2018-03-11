import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import SearchBar from 'material-ui-search-bar';
import MenuItem from 'material-ui/MenuItem';

class WGSearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [
                {
                    text: 'text-value1',
                    value: (
                        <MenuItem
                            primaryText="text-value1"
                            secondaryText="&#9786;"
                        />
                    ),
                },
                {
                    text: 'text-value2',
                    value: (
                        <MenuItem
                            primaryText="text-value2"
                            secondaryText="&#9786;"
                        />
                    ),
                },
            ]
        }
    }

    render() {

        return (
            <Flex>
                <SearchBar
                    onChange={() => console.log('onChange')}
                    onRequestSearch={() => console.log('onRequestSearch')}
                    hintText="Suche"
                    style={{
                        backgroundColor: '#C5CAE9',
                        marginTop: 8,
                        marginRight: 8,
                        maxWidth: 800,
                        color: 'white'
                    }} />
            </Flex>
        )
    }
}
const Flex = styled.div`
    flex: 1;
    display:flex;
    flex-direction: column;
`

const mapStateToProps = state => {
    return {
        masterdata: state.timetable.masterdata,
    };
};

export default connect(mapStateToProps)(WGSearchBar);
