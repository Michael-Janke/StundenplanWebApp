import React from 'react';
import TimetableContainer from './Timetable.container';
import { connect } from 'react-redux';
import ThemedGridCell from '../ThemedGridCell';
import useRows from './useRows';

function NoSwipeTimetableGrid({ periods }) {
    const rows = useRows(periods);

    return (
        <TimetableContainer GridCellComponent={ThemedGridCell} rows={rows}>
            {rows.map((row, i) => {
                const Comp = row.component || ThemedGridCell;

                return <Comp {...row}></Comp>;
            })}
        </TimetableContainer>
    );
}

const mapStateToProps = () => {
    return (state, props) => ({
        periods: state.timetable.masterdata.Period_Time,
    });
};

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NoSwipeTimetableGrid);
