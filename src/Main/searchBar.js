import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import SearchBar from 'material-ui-search-bar';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import PersonIcon from 'material-ui/svg-icons/social/person';
import ClassIcon from 'material-ui/svg-icons/social/group';
import RoomIcon from 'material-ui/svg-icons/action/room';
import {loadAvatars, setTimeTable} from './actions';
import AutoComplete from 'material-ui/AutoComplete';
import moment from 'moment';

class WGSearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: null
        }
        this.mergeDataSource(props.masterdata);
    }

    componentWillUpdate(nextProps) {
        if(nextProps.avatars !== this.props.avatars) {
            this.state.dataSource = null;
        }
        this.mergeDataSource(nextProps.masterdata)
    }

    mergeDataSource(masterdata) {
        if(this.state.dataSource || !masterdata) return;
        const avatar = (upn) => this.props.avatars[upn] && this.props.avatars[upn].img 
            ? <Avatar src={"data:image/jpg;base64," + this.props.avatars[upn].img } size={30} /> 
            : < PersonIcon />;
        this.state.dataSource = [
            ...Object.values(masterdata.Class).map((entry) => ({
                text: "Klasse " + entry.NAME,
                type: "class",
                id: entry.CLASS_ID,
                value: (<MenuItem leftIcon={<ClassIcon />} primaryText={entry.NAME} secondaryText="Klasse" />),
            })),
            ...Object.values(masterdata.Teacher).map((entry) => ({
                text: `Lehrer ${entry.FIRSTNAME} ${entry.LASTNAME}`,
                upn: entry.UPN,
                type: "teacher",
                id: entry.TEACHER_ID,
                value: (<MenuItem leftIcon={avatar(entry.UPN)} primaryText={entry.FIRSTNAME[0] + '. ' + entry.LASTNAME} secondaryText="Lehrer" />),
            })),  
            ...Object.values(masterdata.Student).map((entry) => ({
                text: `Schüler ${entry.FIRSTNAME} ${entry.LASTNAME}`,
                upn: entry.UPN,
                type: "student",
                id: entry.STUDENT_ID,
                value: (<MenuItem leftIcon={avatar(entry.UPN)} primaryText={`${entry.LASTNAME}, ${entry.FIRSTNAME}`} secondaryText="Schüler" />),
            })),  
            ...Object.values(masterdata.Room).map((entry) => ({
                text: "Raum " + entry.NAME,
                type: "room",
                id: entry.ROOM_ID,
                value: (<MenuItem leftIcon={<RoomIcon />} primaryText={entry.NAME} secondaryText="Raum" />),
            })),        
        ]

    }

    loadAvatars(searchText) {
        if(this.props.avatars.loading) return;
        var subset = this.state.dataSource.filter((value) => AutoComplete.fuzzyFilter(searchText, value.text));
        subset = subset.filter((value, i) => i < 10 
            && value.upn 
            && (this.props.avatars[value.upn]===undefined
                || moment(this.props.avatars[value.upn].lastUpdate).diff(moment(), 'days') > 7)        
        );
        if(subset.length > 0) {
            this.props.loadAvatars(subset.map((a) => a.upn));
        }
    }

    render() {
        return (
            <Flex>
                <SearchBar
                    onChange={(searchText) => this.loadAvatars(searchText)}
                    onRequestSearch={() => null}
                    onNewRequest={(chosen) => this.props.setTimeTable(chosen.type, chosen.id)}
                    dataSource={this.state.dataSource}
                    hintText="Suche"
                    maxSearchResults={10}
                    filter={AutoComplete.fuzzyFilter}
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

const mapDispatchToProps = dispatch => {
    return {
        loadAvatars: (upns) => {
            dispatch(loadAvatars(upns));
        },
        setTimeTable: (type, id) => {
            dispatch(setTimeTable(type.id));
        }
    };
};


const mapStateToProps = state => {
    return {
        masterdata: state.timetable.masterdata,
        avatars: state.avatars,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WGSearchBar);