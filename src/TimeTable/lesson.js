import React from 'react';
import styled from "styled-components";
import indigo from '@material-ui/core/colors/indigo';
import grey from '@material-ui/core/colors/grey';
import Typography from '@material-ui/core/Typography';
import { darken } from '@material-ui/core/styles/colorManipulator';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from './Fields';
import Popover from './popover';
import OpenTeamsButton from './components/openTeams';
import Badge from '@material-ui/core/Badge';

const Field = (field, props, customProps) => React.createElement(field, { ...props, ...customProps });
const BindField = (props) => field => Field.bind(null, field, props);

const SubstitutionText = ({ left, children }) => (
    <SubstitutionTextContainer>
        ({children})
    </SubstitutionTextContainer>
);

const AbstractLesson = (props) => {
    let { classes, theme, small, last, multiple, specificSubstitutionType, substitutionText, fields, substitutionInfo, continueation, setTimeTable, reference, team, assignments } = props;
    const styles = specificSubstitutionType ? specificSubstitutionType.style(theme) : {};
    if (continueation) {
        return (
            <Lesson
                type={theme.palette.type}
                color={styles.backgroundColor}
                flex={!specificSubstitutionType || !multiple}>
                <ColorBar lineColor={styles.color} />
            </Lesson>
        );
    }
    const isNew = fields.new;
    const BoundField = BindField({ small, themeClasses: classes, setTimeTable });

    const NewFields = fields.new && fields.new.map(BoundField);
    const OldFields = fields.old && fields.old.map(BoundField);
    const SubstitutingFields = fields.substitution && fields.substitution.map(BoundField);

    let substitutionTextBig = substitutionText && substitutionText.length > 10;
    const substitutionType = specificSubstitutionType && (
        <SubstitutionType color={styles.color}>
            {(!substitutionText || substitutionTextBig) ? specificSubstitutionType.name : substitutionText}
        </SubstitutionType>
    );

    const extraInfo = substitutionTextBig &&
        <SubstitutionText left={small}>
            {substitutionText}
        </SubstitutionText>;

    const [Field1, Field2, Field3] = isNew ? NewFields : OldFields;
    const container =
        isNew ? // new
            (
                small ? // small
                    (
                        <LessonContainer small>
                            {substitutionType}
                            <Field1 left />
                            <Field2 left />
                            <Field3 left />
                        </LessonContainer>
                    ) : // large
                    (
                        <LessonContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 'none' }}>
                                {substitutionType}
                                <Field1 left />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', overflow: 'hidden', paddingLeft: 5 }}>
                                <Field2 />
                                <Field3 />
                            </div>
                        </LessonContainer>
                    )
            ) : // old
            (
                <LessonContainer small={small}>
                    {substitutionType}
                    <div>
                        <Field1 left />
                        {Field2 && <Field2 left />}
                    </div>
                </LessonContainer>
            );



    const popoverActive = true;

    return (
        <Popover active={popoverActive} key={reference.TIMETABLE_ID}>
            {(props, handleOpen) => (
                <Badge color="secondary" badgeContent={assignments.length} invisible={!assignments.length} style={{height: '100%'}}>
                    <Lesson
                        type={theme.palette.type}
                        color={styles.backgroundColor}
                        flex={last}
                        {...props}
                        onClick={handleOpen}
                    >
                        <ColorBar lineColor={styles.color} />
                        <LessonWrapper small={small}>
                            {container}
                            {extraInfo}
                        </LessonWrapper>
                    </Lesson>
                </Badge>
            )}
            {popoverActive &&
                <PopoverContainer>
                    {team && <OpenTeamsButton id={team.id} />}
                    <LessonWrapper>
                        {substitutionType}
                        {SubstitutingFields ?
                            <React.Fragment>
                                <InsteadInformation>
                                    {{ 'instead-of': "statt" }[substitutionInfo]}
                                </InsteadInformation>

                                {SubstitutingFields.map((Field, i) => <Field key={i} description />)}
                            </React.Fragment>
                            : <React.Fragment>
                                <Field1 description />
                                <Field2 description />
                                {Field3 && <Field3 description />}
                            </React.Fragment>
                        }
                    </LessonWrapper>
                    {!!assignments.length && <div>
                        <Typography variant="h6" gutterBottom>
                            Hausaufgaben
                        </Typography>
                        {assignments.map((assignment) => {
                            return <Typography key={assignment.id} variant="body1">{assignment.displayName}</Typography>;
                        }) }
                    </div>}
                </PopoverContainer>
            }
        </Popover>
    );

};

const PopoverContainer = styled.div`
    display: flex;
    flex-direction: column;    
`;


const ColorBar = styled.div`
    width: 3%;
    margin-right:5px;
    background-color: ${props => props.lineColor || indigo[100]};
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
    width: 30px;
    white-space: nowrap;
    color: ${props => props.color};
`;

const InsteadInformation = styled.div`
    font-size: 50%;
    font-weight: 600;
    color: ${grey[400]};
`;

const LessonContainer = styled.div`
    display: flex;
    overflow: hidden;
    width: 100%;
    ${props => (props.small ? `
        flex-direction: column;  
    `: `
        flex-direction: row;
        align-items: center; 
        justify-content: space-between;
    `)}
    ${props => props.tab && props.small && `
        padding-left: 0.5vmin;
    `}
`;

const LessonWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    overflow: hidden;
    justify-content: center;
    ${props => (props.small ? `
        padding-top: 0.25vmin;
        padding-bottom: 0.25vmin;
    `: `
        padding-top: 0.5vmin;
        padding-bottom: 0.5vmin;
    `)}
`;

const Lesson = styled.div`
    flex: ${props => props.flex ? 'auto' : 'auto'};
    display: flex;
    overflow: hidden;
    text-align: left;
    padding-right: 1vmin;
    flex-direction: row;
    background-color: ${props => props.color || darken(indigo[50], props.type === 'dark' ? 0.6 : 0)};
`;

export default withStyles(styles, { withTheme: true })(AbstractLesson);