import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { getDates, deleteDate, editDate, addDate} from "./actions";
import makeGetCurrentDates from "../Selector/dates";
import DateDialog from "./DateDialog";
import Date from "./Date";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import grey from '@material-ui/core/colors/grey';
import CalendarIcon from '@material-ui/icons/Event';
import EditIcon from '@material-ui/icons/Create';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import moment from 'moment';

const styles = theme => ({
    fabButton: {
        position: "absolute",
        right: theme.spacing.unit * 2,
        bottom: theme.spacing.unit * 2,
        zIndex: 2,
    },
    header: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
        paddingTop: 0,
        paddingBottom: 0,
    },
    root: {
        height: '100%',
        display: "flex",
        width: "100%",
        flexDirection: "column",
    },
    list:{
        position: 'relative',
        overflow: 'auto',
        maxHeight: '75vh',
        paddingTop: 0,
    },
    subheader:{
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.paper : grey[200],
    },
    buffer:{
        height: '75vh'
    }
});

class Dates extends Component {

    constructor(props) {
        super(props);
        this.props.getDates();
        this.state = {
            selectedDate: {},
            dialogOpen: false,
            editMode: false
        };
    }

    handleDateAddEdit = (date) => {
        this.setState({
            dialogOpen: false, 
            selectedDate: {}
        });
        if(!date) return;
        if(date.DATE_ID) {
            this.props.editDate(date);
        } else {
            this.props.addDate(date);
        }            
    }

    openDialog = (date) => {
        this.setState({
            selectedDate: date || {},
            edit: !!date,
            dialogOpen: true
        });
    }

    deleteDate = (date) => {
        this.props.deleteDate(date);
    }

    setEditMode = () => {
        this.setState({editMode: !this.state.editMode});
    }

    renderDates = (dates, header, date) => {
        let array = [];
        let prev;
        for(let i = 0; i<dates.length; i++) {
            let mDate = moment(dates[i].DATE_FROM.date);
            if(!prev || moment(prev.DATE_FROM.date).month() !== mDate.month()) {
                array.push(header(mDate.format("MMMM YY")))
            }
            array.push(date(dates[i]));
            prev = dates[i];
        }
        return array;

    }

    componentDidMount() {
        this.scrollToMonth();
    }

    componentDidUpdate(){
        this.scrollToMonth();
    }

    monthRefs={};

    scrollToMonth = () => {
        const selectedMonth =  this.props.timetableDate.format("MMMM YY");
        this.monthRefs[selectedMonth] 
            && this.monthRefs[selectedMonth].scrollIntoView({block: 'start', behavior: 'smooth'});
    }

    render() {
        const { classes, isAdmin} = this.props;
        const { editMode } = this.state;
        
        const dates = this.props.dates;

        return (
            <Paper square={true} className={classes.root}>
                <List className={classes.header}>
                    <ListItem>
                        <ListItemIcon>
                            <CalendarIcon />
                        </ListItemIcon>
                        <ListItemText primary="Termine" />
                        <ListItemSecondaryAction>
                            {isAdmin && <IconButton onClick={this.setEditMode}><EditIcon/></IconButton>}
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>

                <List className={classes.list}>
                    {dates && this.renderDates(dates, 
                        (title) => <ListSubheader 
                                        className={classes.subheader}  
                                        key={title}
                                    >   <div
                                            ref={ (node) => this.monthRefs[title] = node}>
                                            {title}
                                        </div></ListSubheader>,
                        (date) => <Date 
                                    date={date} 
                                    key={date.DATE_ID} 
                                    onEdit={isAdmin && editMode && date.DATE_ID > 0 ? () => this.openDialog(date) : undefined}
                                    onDelete={isAdmin && editMode && date.DATE_ID > 0 ? () => this.deleteDate() : undefined}
                                />
                    )}
                    <div className={classes.buffer}>
                        {!dates && "Keine Termine eingetragen"}
                    </div>
                </List>

                <DateDialog 
                    open={this.state.dialogOpen} 
                    handleClose={this.handleDateAddEdit} 
                    date={this.state.selectedDate} 
                    edit={this.state.edit}
                />
                {editMode && 
                    <Button 
                        variant="fab" 
                        mini
                        className={classes.fabButton} 
                        color="primary"
                        onClick={() => this.openDialog()} >
                        <AddIcon />
                    </Button>}
            </Paper>
        );
    }
}

const makeMapStateToProps = () => {
    const getCurrentDates = makeGetCurrentDates();
    const mapStateToProps = (state, props) => {
        return {
            timetableDate: state.timetable.timetableDate,
            min: state.timetable.masterdata.minMaxDates.min,
            max: state.timetable.masterdata.minMaxDates.max,
            dates: getCurrentDates(state),
            isAdmin: state.user.scope === 'admin'
        }
    }
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({
    getDates: () => dispatch(getDates()),
    deleteDate: (date) => dispatch(deleteDate(date)),
    addDate: (date) => dispatch(addDate(date)),
    editDate: (date) => dispatch(editDate(date)),
});

export default connect(makeMapStateToProps, mapDispatchToProps)(withStyles(styles)(Dates)); 