import { connect } from 'react-redux';

const Name = ({ upn, masterdata }) => {
    const student = masterdata && Object.values(masterdata.Student).filter((student) => student.UPN === upn)[0];
    if (student) {
        return 'Schüler, ' + masterdata.Class[student.CLASS_ID].NAME;
    }
    const teacher = masterdata && Object.values(masterdata.Teacher).filter((student) => student.UPN === upn)[0];
    if (teacher) {
        return 'Lehrer';
    }
    return 'unbekannt';
};

const mapStateToProps = ({ timetable }) => ({
    masterdata: timetable.masterdata,
});

export default connect(mapStateToProps)(Name);
