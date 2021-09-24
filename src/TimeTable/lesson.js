import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import indigo from '@material-ui/core/colors/indigo';
import grey from '@material-ui/core/colors/grey';
import { darken } from '@material-ui/core/styles/colorManipulator';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from './Fields';
import Popover from './popover';
import OpenOfficeButton from './components/officeLink';
import Assignments from './components/assignments';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import DoneIcon from '@material-ui/icons/Done';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';
import AddAssignment from './components/addAssignment';
import ShowStudentList from './components/showStudentList';

const Field = (field, props, customProps) => React.createElement(field, { ...props, ...customProps });
const BindField = (props) => (field) => Field.bind(null, field, props);

const SubstitutionText = ({ children }) => <SubstitutionTextContainer>({children})</SubstitutionTextContainer>;

const AbstractLesson = (props) => {
    let { theme, small, fields, setTimeTable, isTeacher, date, lesson, classes } = props;
    let { specificSubstitutionType, substitutionText, reference, teams, assignments, studentList } = lesson;

    const styles = specificSubstitutionType ? specificSubstitutionType.style(theme) : {};
    const isNew = fields.new;
    const BoundField = BindField({
        small,
        themeClasses: classes,
        setTimeTable,
    });

    const NewFields = fields.new && fields.new.map(BoundField);
    const OldFields = fields.old && fields.old.map(BoundField);
    const SubstitutingFields = fields.substitution && fields.substitution.map(BoundField);

    let substitutionTextBig = substitutionText && substitutionText.length > 10;
    const substitutionType = specificSubstitutionType && (
        <SubstitutionType color={styles.color}>
            {!substitutionText || substitutionTextBig ? specificSubstitutionType.name : substitutionText}
        </SubstitutionType>
    );

    const extraInfo = substitutionTextBig && <SubstitutionText left={small}>{substitutionText}</SubstitutionText>;

    const [Field1, Field2, Field3] = isNew ? NewFields : OldFields;
    const container = isNew ? ( // new
        small ? ( // small
            <LessonContainer small>
                {substitutionType}
                <Field1 left />
                <Field2 left />
                <Field3 left />
            </LessonContainer>
        ) : (
            // large
            <LessonContainer>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        overflow: 'hidden',
                    }}
                >
                    {substitutionType}
                    <Field1 left />
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        textAlign: 'right',
                        overflow: 'hidden',
                        paddingLeft: 5,
                    }}
                >
                    <Field2 />
                    <Field3 />
                </div>
            </LessonContainer>
        )
    ) : (
        // old
        <LessonContainer small={small}>
            {substitutionType}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: small ? 'flex-start' : 'flex-end',
                    textAlign: small ? 'left' : 'right',
                    overflow: 'hidden',
                }}
            >
                <Field1 />
                {Field2 && <Field2 />}
            </div>
        </LessonContainer>
    );

    const popoverActive = true;
    const allDoneAssignments = assignments.every((assignment) =>
        assignment.submissions ? assignment.submissions.every((submission) => submission.status === 'submitted') : false
    );
    const hasDrafts = assignments.some((assignment) => assignment.status === 'draft');
    const badgeContent = isTeacher ? (
        <AssignmentIcon
            style={{ fontSize: '1rem', marginRight: '5px', marginTop: '5px', color: hasDrafts ? grey[500] : undefined }}
        />
    ) : allDoneAssignments ? (
        <DoneIcon />
    ) : (
        assignments.length
    );
    return (
        <Popover active={popoverActive} key={reference.TIMETABLE_ID}>
            {(props, handleOpen) => (
                <Badge
                    component="div"
                    color={allDoneAssignments ? 'default' : 'secondary'}
                    badgeContent={badgeContent}
                    invisible={assignments.length === 0}
                    style={{ display: 'flex', flex: 'auto' }}
                    classes={{ colorPrimary: classes.badgeColor }}
                >
                    <Lesson type={theme.palette.type} color={styles.backgroundColor} {...props} onClick={handleOpen}>
                        <ColorBar lineColor={styles.color} />
                        <LessonWrapper small={small}>
                            {container}
                            {extraInfo}
                        </LessonWrapper>
                    </Lesson>
                </Badge>
            )}
            {popoverActive && (
                <List>
                    {specificSubstitutionType && (
                        <ListSubheader component="div">{specificSubstitutionType.name}</ListSubheader>
                    )}
                    {SubstitutingFields && (
                        <React.Fragment>
                            {SubstitutingFields.map((Field, i) => (
                                <Field key={i} description />
                            ))}
                            <Divider />
                        </React.Fragment>
                    )}
                    <Field1 description />
                    <Field2 description />
                    {Field3 && <Field3 description />}
                    <ShowStudentList list={studentList} reference={reference} date={date} />
                    {teams.map((team) => (
                        <React.Fragment key={team.id}>
                            <Divider />
                            {teams.length === 0 && <ListSubheader component="div">{team.displayName}</ListSubheader>}
                            <OpenOfficeButton id={team.id} type="teams" />
                            <OpenOfficeButton id={team.id} type="notebook" />
                            {isTeacher && <AddAssignment team={team} date={date} />}
                        </React.Fragment>
                    ))}
                    {!!assignments.length && (
                        <React.Fragment>
                            <Divider />
                            <Assignments assignments={assignments} />
                        </React.Fragment>
                    )}
                </List>
            )}
        </Popover>
    );
};

const ColorBar = styled.div`
    width: 3%;
    margin-right: 5px;
    background-color: ${(props) => props.lineColor || indigo[100]};
`;

const SubstitutionTextContainer = styled.div`
    font-size: 60%;
    color: ${grey[500]};
    overflow: hidden;
    word-break: break-word;
    white-space: normal;
    align-items: center;
    display: flex;
`;

const SubstitutionType = styled.div`
    font-size: 60%;
    font-weight: 600;
    white-space: nowrap;
    color: ${(props) => props.color};
    overflow: hidden;
`;

const LessonContainer = styled.div`
    display: flex;
    overflow: hidden;
    width: 100%;
    ${(props) =>
        props.small
            ? `
        flex-direction: column;  
    `
            : `
        flex-direction: row;
        align-items: center; 
        justify-content: space-between;
    `}
`;

const LessonWrapper = styled.div`
    cursor: pointer;
    display: flex;
    width: 100%;
    flex-direction: column;
    overflow: hidden;
    justify-content: center;
    ${(props) =>
        props.small
            ? `
        padding-top: 0.25vmin;
        padding-bottom: 0.25vmin;
    `
            : `
        padding-top: 0.5vmin;
        padding-bottom: 0.5vmin;
    `}
`;

const Lesson = styled.div`
    flex: ${(props) => (props.flex ? 'auto' : 'auto')};
    display: flex;
    overflow: hidden;
    text-align: left;
    padding-right: 1vmin;
    flex-direction: row;
    background-color: ${(props) => props.color || darken(indigo[50], props.type === 'dark' ? 0.6 : 0)};
`;
const mapStateToProps = ({ user }) => ({ isTeacher: user.type === 'teacher' });
export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(AbstractLesson));
