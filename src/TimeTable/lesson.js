import React from 'react';
import styled from "styled-components";
import ActionInfo from '@material-ui/icons/Info';
import indigo from '@material-ui/core/colors/indigo';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core';
import { subjectStyles } from './Fields/subject';
import { roomStyles } from './Fields/room';
import { classStyles } from './Fields/classes';
import { teacherStyles } from './Fields/teachers';

const Field = (field, props, customProps) => React.createElement(field, { ...props, ...customProps });
const BindField = (props) => field => Field.bind(null, field, props);

const SubstitutionText = ({ children }) => (
    <SubstitutionTextContainer>
        <ActionInfo style={{ width: 16, height: 16, marginRight: '0.3vmin' }} />
        <div style={{ flex: 1 }}>{children}</div>
    </SubstitutionTextContainer>
);

const styles = theme => ({
    ...subjectStyles(theme),
    ...roomStyles(theme),
    ...teacherStyles(theme),
    ...classStyles(theme),
});


const AbstractLesson = (props) => {
    let { classes, theme, colorBar, small, last, multiple, specificSubstitutionType, substitutionText, fields, absence, substitutionInfo } = props;
    const isNew = fields.new;
    const isOld = fields.old;
    const BoundField = BindField({ small, themeClasses: classes });

    const NewFields = fields.new && fields.new.map(BoundField);
    const OldFields = fields.old && fields.old.map(BoundField);
    const SubstitutingFields = fields.substitution && fields.substitution.map(BoundField);

    let substitutionTextBig = substitutionText && substitutionText.length > 16;
    const substitutionType = specificSubstitutionType && (
        <SubstitutionType color={specificSubstitutionType.color}>
            {(!substitutionText || substitutionTextBig) ? specificSubstitutionType.name : substitutionText}
        </SubstitutionType>
    );

    const extraInfo = (substitutionTextBig || absence) && (
        <SubstitutionText>
            {substitutionText ? substitutionText + (absence ? ` (${absence.TEXT})` : "") : absence.TEXT}
        </SubstitutionText>
    );



    let InsteadBy;
    if (!small)
        InsteadBy = substitutionInfo === 'instead-by' ?
            (...fields) => (
                <LessonContainer>
                    durch:
                    {fields.map((Field, i) => <Field key={i} left />)}
                </LessonContainer>
            )
            : null;

    let InsteadOf;
    if (!small)
        InsteadOf = substitutionInfo === 'instead-of' ?
            (...fields) => (
                <LessonContainer>
                    statt:
                    {fields.map((Field, i) => <Field key={i} left />)}
                </LessonContainer>
            )
            : null;

    if (isNew) {
        if (!small) {
            const [Field1, Field2, Field3] = NewFields;
            return (
                <Lesson
                    type={theme.palette.type}
                    color={(specificSubstitutionType || {}).backgroundColor}
                    flex={!specificSubstitutionType || !multiple}>
                    <ColorBar lineColor={colorBar} />
                    <LessonWrapper>
                        {InsteadOf && InsteadOf(...SubstitutingFields)}
                        <LessonContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}>
                                {substitutionType}
                                <Field1 left />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', overflow: 'hidden', paddingLeft: 5 }}>
                                <Field2 />
                                <Field3 />
                            </div>
                        </LessonContainer>
                        {InsteadBy && InsteadBy(...SubstitutingFields)}
                        {extraInfo}
                    </LessonWrapper>
                </Lesson>

            );
        } else {
            const [Field1, Field2, Field3] = NewFields;
            return (
                <Lesson
                    type={theme.palette.type}
                    color={(specificSubstitutionType || {}).backgroundColor}
                    flex={last}>
                    <ColorBar lineColor={colorBar} />
                    <LessonWrapper>
                        {InsteadOf && InsteadOf(...SubstitutingFields)}
                        <LessonContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}>
                                {substitutionType}
                                <Field1 left />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', overflow: 'hidden', paddingLeft: 5 }}>
                                <Field2 />
                            </div>
                        </LessonContainer>
                        <Field3 />
                        {InsteadBy && InsteadBy(...SubstitutingFields)}
                        {extraInfo}
                    </LessonWrapper>
                </Lesson>

            );
        }
    }
    if (isOld) {
        if (!small) {
            const [Field1, Field2] = OldFields;
            return (
                <Lesson
                    type={theme.palette.type}
                    color={(specificSubstitutionType || {}).backgroundColor}
                    flex={!specificSubstitutionType || !multiple}>
                    <LessonWrapper>
                        {InsteadOf && InsteadOf(...SubstitutingFields)}
                        <LessonContainer>
                            {substitutionType}
                            <Field1 left />
                            {Field2 && <Field2 left />}
                        </LessonContainer>
                        {InsteadBy && InsteadBy(...SubstitutingFields)}
                        {extraInfo}
                    </LessonWrapper>
                </Lesson>
            );
        } else {
            const [Field1, Field2] = OldFields;
            return (
                <Lesson
                    type={theme.palette.type}
                    color={(specificSubstitutionType || {}).backgroundColor}
                    flex={last}>
                    <LessonWrapper>
                        {InsteadOf && InsteadOf(...SubstitutingFields)}
                        <LessonContainer>
                            {substitutionType}
                            <Field1 left />
                            {Field2 && <Field2 left />}
                        </LessonContainer>
                        {InsteadBy && InsteadBy(...SubstitutingFields)}
                        {extraInfo}
                    </LessonWrapper>
                </Lesson>
            )
        }
    }
};




const ColorBar = styled.div`
    width: 3%;
    margin-right:5px;
    background-color: ${props => props.lineColor || indigo[100]};
`;

const SubstitutionType = styled.div`
    font-size: 60%;
    font-weight: 600;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: ${props => props.color};
`;

const SubstitutionTextContainer = styled.div`
    font-size: 70%;
    white-space: normal;
    align-items: center;
    display: flex;
`;

const LessonContainer = styled.div`
    display: flex;
    overflow: hidden;
    width: 100%;
    ${props => (props.small ? `
        flex-direction: column;  
        padding-top: 0.25vmin;
        padding-bottom: 0.25vmin;
    `: `
        flex-direction: row;
        align-items: center; 
        justify-content: space-between;
        padding-top: 0.5vmin;
        padding-bottom: 0.5vmin;
    `)}
`;

const LessonWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    overflow: hidden;
    justify-content: center;
`;

const Lesson = styled.div`
    flex: ${props => props.flex ? 1 : 'none'};
    display: flex;
    overflow: hidden;
    text-align: left;
    padding-right: 1vmin;
    flex-direction: row;
    background-color: ${props => (props.type === 'dark' ? darken : (c) => c)((props.color) || indigo[50], 0.6
    )};
`;

export default withStyles(styles, { withTheme: true })(AbstractLesson);