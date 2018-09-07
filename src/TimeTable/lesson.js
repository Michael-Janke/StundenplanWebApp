import React from 'react';
import styled from "styled-components";
import indigo from '@material-ui/core/colors/indigo';
import grey from '@material-ui/core/colors/grey';

import { darken } from '@material-ui/core/styles/colorManipulator';
import withStyles from '@material-ui/core/styles/withStyles';
import { styles } from './Fields';

const Field = (field, props, customProps) => React.createElement(field, { ...props, ...customProps });
const BindField = (props) => field => Field.bind(null, field, props);

const SubstitutionText = ({ left, children }) => (
    <SubstitutionTextContainer>
        ({children})
    </SubstitutionTextContainer>
);

const AbstractLesson = (props) => {
    let { classes, theme, colorBar, small, last, multiple, specificSubstitutionType, substitutionText, fields, absence, substitutionInfo, continueation } = props;
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
    const isOld = fields.old;


    const BoundField = BindField({ small, themeClasses: classes });

    const NewFields = fields.new && fields.new.map(BoundField);
    const OldFields = fields.old && fields.old.map(BoundField);
    const SubstitutingFields = fields.substitution && fields.substitution.map(BoundField);

    let substitutionTextBig = substitutionText && substitutionText.length > 10;
    const substitutionType = specificSubstitutionType && (
        <SubstitutionType color={styles.color}>
            {(!substitutionText || substitutionTextBig) ? specificSubstitutionType.name : substitutionText}
        </SubstitutionType>
    );

    const extraInfo = substitutionText &&
        <SubstitutionText left={small}>
            {substitutionText}
        </SubstitutionText>;

    let InsteadBy;
    if (substitutionInfo === 'instead-by') {
        if (small) {
            InsteadBy = (...fields) => (
                <LessonContainer tab small>
                    {fields.map((Field, i) => <Field key={i} left />)}
                </LessonContainer>
            );
        }
        else {
            InsteadBy = (...fields) => (
                <LessonContainer tab>
                    {fields.map((Field, i) => <Field key={i} left />)}
                </LessonContainer>
            );
        }
    }

    let InsteadOf;
    if (substitutionInfo === 'instead-of') {
        if (small) {
            InsteadOf = (...fields) => (
                <LessonContainer tab small>
                    <InsteadInformation>statt:</InsteadInformation>
                    {fields.map((Field, i) => <Field key={i} left />)}
                </LessonContainer>
            )
        } else {
            InsteadOf = (...fields) => (
                <LessonContainer tab>
                    <InsteadInformation>statt:</InsteadInformation>
                    {fields.map((Field, i) => <Field key={i} left />)}
                </LessonContainer>
            )
        }
    }
    InsteadOf=undefined; //todo as popover

    if (isNew) {
        if (!small) {
            const [Field1, Field2, Field3] = NewFields;
            return (
                <Lesson
                    type={theme.palette.type}
                    color={styles.backgroundColor}
                    flex={!specificSubstitutionType || !multiple}>
                    <ColorBar lineColor={styles.color} />
                    <LessonWrapper>
                        {InsteadOf && InsteadOf(...SubstitutingFields)}
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
                    <ColorBar lineColor={styles.color} />
                    <LessonWrapper small>
                        {InsteadOf && InsteadOf(...SubstitutingFields)}
                        <LessonContainer small>
                            {substitutionType}
                            <Field1 left />
                            <Field2 left/>
                            <Field3 left/>
                        </LessonContainer>
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
                        <ColorBar lineColor={styles.color} />
                        <LessonWrapper>
                            {InsteadOf && InsteadOf(...SubstitutingFields)}
                            <LessonContainer>
                                {substitutionType}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', overflow: 'hidden', paddingLeft: 5 }}>
                                    <Field1/>
                                    {Field2 && <Field2 />}
                                </div>
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
                        <ColorBar lineColor={styles.color} />
                        {InsteadOf && InsteadOf(...SubstitutingFields)}
                        <LessonWrapper small>
                            <LessonContainer small>
                                {substitutionType}
                                <Field1 left/>
                                {Field2 && <Field2 left />}
                            </LessonContainer>
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