import { connect } from 'react-redux';

const Name = ({ upn, masterdata }) => {
    const student = masterdata && Object.values(masterdata.Student).filter(student => student.UPN === upn)[0];
    if (student) {
        return `${student.FIRSTNAME} ${student.LASTNAME}`;
    }
    const teacher = masterdata && Object.values(masterdata.Teacher).filter(student => student.UPN === upn)[0];
    if (teacher) {
        const initial = teacher.FIRSTNAME[0];
        return `${initial}. ${teacher.LASTNAME}`;
    }
    return 'unbekannt';
};

const mapStateToProps = ({ timetable }) => ({
    masterdata: timetable.masterdata,
});

export default connect(mapStateToProps)(Name);
