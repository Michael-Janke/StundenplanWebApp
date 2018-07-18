import React from 'react';
import styled from "styled-components";
import ActionInfo from '@material-ui/icons/Info';
import indigo from '@material-ui/core/colors/indigo';
import grey from '@material-ui/core/colors/grey';

import { darken } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core';
import { styles } from './Fields';

const Field = (field, props, customProps) => React.createElement(field, { ...props, ...customProps });
const BindField = (props) => field => Field.bind(null, field, props);

const SubstitutionText = ({ children }) => (
    <SubstitutionTextContainer>
        <ActionInfo style={{ width: 16, height: 16, marginRight: '0.3vmin' }} />
        <div style={{ flex: 1 }}>{children}</div>
    </SubstitutionTextContainer>
);




const AbstractLesson = (props) => {
    let { classes, theme, colorBar, small, last, multiple, specificSubstitutionType, substitutionText, fields, absence, substitutionInfo } = props;
    const isNew = fields.new;
    const isOld = fields.old;
    const styles = specificSubstitutionType ? specificSubstitutionType.style(theme) : {};


    const BoundField = BindField({ small, themeClasses: classes });

    const NewFields = fields.new && fields.new.map(BoundField);
    const OldFields = fields.old && fields.old.map(BoundField);
    const SubstitutingFields = fields.substitution && fields.substitution.map(BoundField);

    let substitutionTextBig = substitutionText && substitutionText.length > 5;
    const substitutionType = specificSubstitutionType && (
        <SubstitutionType color={styles.color}>
            {(!substitutionText || substitutionTextBig) ? specificSubstitutionType.name : substitutionText}
        </SubstitutionType>
    );

    const extraInfo = (substitutionTextBig || absence) && (
        <SubstitutionText>
            {substitutionText ? substitutionText + (absence ? ` (${absence.TEXT})` : "") : absence.TEXT}
        </SubstitutionText>
    );



    let InsteadBy;
    if (substitutionInfo === 'instead-by') {
        if (small) {
            InsteadBy = (...fields) => (
                <LessonWrapper>
                    <InsteadInformation>durch:</InsteadInformation>
                    {fields.map((Field, i) => <Field key={i} left />)}
                </LessonWrapper>
            );
        }
        else {
            InsteadBy = (...fields) => (
                <LessonContainer>
                    <InsteadInformation>durch:</InsteadInformation>
                    {fields.map((Field, i) => <Field key={i} left />)}
                </LessonContainer>
            );
        }
    }

    let InsteadOf;
    if (substitutionInfo === 'instead-of') {
        if (small) {
            InsteadOf = (...fields) => (
                <LessonWrapper>
                    <InsteadInformation>statt:</InsteadInformation>
                    {fields.map((Field, i) => <Field key={i} left />)}
                </LessonWrapper>
            )
        } else {
            InsteadOf = (...fields) => (
                <LessonContainer>
                    <InsteadInformation>statt:</InsteadInformation>
                    {fields.map((Field, i) => <Field key={i} left />)}
                </LessonContainer>
            )
        }
    }

    if (isNew) {
        if (!small) {
            const [Field1, Field2, Field3] = NewFields;
            return (
                <Lesson
                    type={theme.palette.type}
                    color={styles.backgroundColor}
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
                    color={styles.backgroundColor}
                    flex={last}>
                    <ColorBar lineColor={colorBar} />
                    <LessonWrapper>
                        {InsteadOf && InsteadOf(...SubstitutingFields)}
                        {substitutionType}
                        <Field1 left />
                        <Field2 />
                        <Field3 />
                        {InsteadBy && InsteadBy(...SubstitutingFields)}
                        {extraInfo}
                    </LessonWrapper>
                </Lesson>

            );
        }
    } else
    if (isOld) {
        if (!small) {
            const [Field1, Field2] = OldFields;
            return (
                <Lesson
                    type={theme.palette.type}
                    color={styles.backgroundColor}
                    flex={!specificSubstitutionType || !multiple}>
                    <ColorBar lineColor={colorBar} />
                    <LessonWrapper>
                        {InsteadOf && InsteadOf(...SubstitutingFields)}
                        {substitutionType}
                        <LessonContainer>
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
                    color={styles.backgroundColor}
                    flex={last}>
                    <ColorBar lineColor={colorBar} />
                    <LessonWrapper>
                        {InsteadOf && InsteadOf(...SubstitutingFields)}
                        {substitutionType}
                        <Field1 left />
                        {Field2 && <Field2 left />}
                        {InsteadBy && InsteadBy(...SubstitutingFields)}
                        {extraInfo}
                    </LessonWrapper>
                </Lesson>
            )
        }
    } else {
        return null;
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
    overflow: hidden;
    word-break: break-word;
    white-space: normal;
    align-items: center;
    display: flex;
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
    background-color: ${props => props.color || darken(indigo[50], props.type === 'dark' ? 0.6 : 0)};

`;

export default withStyles(styles, { withTheme: true })(AbstractLesson);