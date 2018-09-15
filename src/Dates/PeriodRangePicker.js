import React from 'react';
import { connect } from 'react-redux';
import { Popover, Button, DialogActions, DialogTitle, DialogContent, Checkbox, withStyles } from '@material-ui/core';
import moment from 'moment';
class PeriodRangePicker extends React.Component {
    state = {
        anchorEl: null,
        open: false,
        period: {

        }
    };

    handleChange = period => () => {
        const periods = this.state.period;
        const selectedType = periods.to === period
            ? 'to'
            : periods.from === period
                ? 'from' : false;
        let type = periods.from
            && (periods.from.PERIOD_TIME_ID < period.PERIOD_TIME_ID || !periods.to) ? 'to' : 'from';
        type = selectedType || type;


        this.setState({
            period: {
                ...periods,
                [type]: selectedType ? null : period,
            }
        })
    };

    handleClick = event => {
        const { currentTarget } = event;
        this.setState(state => ({
            anchorEl: currentTarget,
            open: !state.open,
        }));
    };

    handleClose = () => {
        let { from, to } = this.props;
        from = moment(from);
        to = moment(to);
        let { from: fromPeriod, to: toPeriod } = this.state.period;
        if (!fromPeriod) {
            return;
        }
        toPeriod = toPeriod || fromPeriod;
        from.hours(fromPeriod.START_TIME / 100);
        from.minutes(fromPeriod.START_TIME % 100);
        to.hours(toPeriod.END_TIME / 100);
        to.minutes(toPeriod.END_TIME % 100);
        from = from.toDate();
        to = to.toDate();
        this.props.onChange(from, to);
        this.handleClick({});
    }

    render() {
        const { classes, periods } = this.props;
        const { anchorEl, open } = this.state;
        const id = open ? 'simple-popper2' : null;
        return (
            <div>
                <Button aria-describedby={id} variant="flat" onClick={this.handleClick}>
                    Stunden auswählen
                </Button>
                <Popover id={id} open={open} anchorEl={anchorEl} onClose={this.handleClick}>
                    <DialogTitle id="alert-dialog-title">{"Stunden auswählen"}</DialogTitle>
                    <DialogContent className={classes.content}>
                        {Object.values(periods).map((period, i) => {
                            return (
                                <div key={i} className={classes.checkboxContainer}>
                                    {i}.
                                    <Checkbox
                                        className={classes.checkbox}
                                        checked={Object.values(this.state.period).indexOf(period) !== -1}
                                        onChange={this.handleChange(period)}
                                    />
                                </div>
                            );
                        })}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClick} color="primary">
                            Abbrechen
                         </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Popover>
            </div>
        )
    }
}

const styles = theme => ({
    checkbox: {
        padding: 0,
        height: 'unset',
        width: 'unset',
    },
    checkboxContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    content: {
        display: 'flex',
    }
});

const mapStateToProps = state => ({
    periods: state.timetable.masterdata.Period_Time,
});

export default connect(mapStateToProps)(withStyles(styles)(PeriodRangePicker));
