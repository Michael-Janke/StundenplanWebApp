import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DatePicker } from 'material-ui';
import moment from 'moment';
import { setDate } from '../actions';

function disableWeekends(date) {
    return date.getDay() === 0 || date.getDay() === 6;
}
let DateTimeFormat;

/**
 * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
 */
// if (areIntlLocalesSupported(['fr', 'fa-IR'])) {
    DateTimeFormat = global.Intl.DateTimeFormat;
// } else {
//     const IntlPolyfill = require('intl');
//     DateTimeFormat = IntlPolyfill.DateTimeFormat;
//     require('intl/locale-data/jsonp/fr');
//     require('intl/locale-data/jsonp/fa-IR');
// }

export class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.calculateMinMax(props.min, props.max),
            currentDate: moment(props.timetableDate).toDate()
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.min !== this.props.min || nextProps.max !== this.props.max) {
            this.setState(this.calculateMinMax(nextProps.min, nextProps.max));
        }
        if (nextProps.timetableDate !== this.props.timetableDate) {
            this.setState({ currentDate: moment(nextProps.timetableDate).toDate() });
        }
    }

    calculateMinMax(min, max) {
        if (!min || !max) {
            return null;
        }
        return {
            minDate: moment()
                .year(min.year)
                .week(min.week)
                .add(-1, 'week')
                .toDate(),
            maxDate: moment()
                .year(max.year)
                .week(max.week)
                .add(1, 'week')
                .toDate(),
        }
    }

    open() {
        this.refs.datePicker.openDialog();
    }

    handleChange = (_, date) => {
        this.props.changeDate(date);
    }

    render() {
        return (
            <div>
                <DatePicker
                    autoOk
                    locale="de"
                    DateTimeFormat={DateTimeFormat}
                    shouldDisableDate={disableWeekends}
                    minDate={this.state.minDate}
                    maxDate={this.state.maxDate}
                    onChange={this.handleChange}
                    value={this.state.currentDate}
                    textFieldStyle={{ display: 'none' }} // ugly
                    ref="datePicker"
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    min: state.timetable.masterdata.minMaxDates.min,
    max: state.timetable.masterdata.minMaxDates.max,
    timetableDate: state.timetable.timetableDate,
})

const mapDispatchToProps = (dispatch) => ({
    changeDate: (date) => dispatch(setDate(date))
});

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Calendar);