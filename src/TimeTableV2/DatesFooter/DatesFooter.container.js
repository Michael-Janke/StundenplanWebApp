import Dates from './DatesFooter.component';
import { connect } from 'react-redux';
import { layoutedDatesSelector } from './DatesFooter.selector';


const mapStateToProps = (state, props) => ({
  dates: layoutedDatesSelector(state, props),
  
});

const ConnectedDates = connect(mapStateToProps)(Dates);
export default ConnectedDates;
