import { connect } from 'react-redux';
import GridSwiperContainer from './Grid.swiper.component';

const mapStateToProps = () => {
    return (state, props) => ({
        periods: state.timetable.masterdata.Period_Time,
    })
}


export default connect(mapStateToProps, undefined)(GridSwiperContainer);