import React from 'react';
import styled from "styled-components";
import { grey600, grey500 } from 'material-ui/styles/colors';
import ActionInfo from 'material-ui/svg-icons/action/info';
import { indigo50 } from 'material-ui/styles/colors';

const Field = (field, props, customProps) => (<field.reactClass {...field.props} {...props} {...customProps} />);

const SubstitutionText = ({ children }) => (
    <SubstitutionTextContainer color={grey600}>
        <ActionInfo style={{ width: 16, height: 16, marginRight: '0.3vmin' }} color={grey500} />
        <div style={{ flex: 1 }}>{children}</div>
    </SubstitutionTextContainer>
)

const AbstractLesson = ({ colorBar, small, last, multiple, specificSubstitutionType, substitutionText, fields, removalField }) => {

    const Field1 = Field.bind(null, fields[0], { small });
    const Field2 = Field.bind(null, fields[1], { small });
    const Field3 = Field.bind(null, fields[2], { small });
    const RemovalField = removalField && Field.bind(null, removalField, { small });

    if (!small) return (
        <Lesson color={(specificSubstitutionType || {}).backgroundColor} flex={!specificSubstitutionType || !multiple}>
            <ColorBar lineColor={colorBar} />
            <LessonWrapper>
                <LessonContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden' }}>
                        {specificSubstitutionType &&
                            <SubstitutionType color={specificSubstitutionType.color}>{specificSubstitutionType.name}</SubstitutionType>
                        }
                        <Field1 />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', overflow: 'hidden', paddingLeft: 5 }}>
                        <Field2 />
                        <Field3 />
                    </div>
                </LessonContainer>
                {removalField && <RemovalField />}
                {substitutionText && <SubstitutionText>{substitutionText}</SubstitutionText>}
            </LessonWrapper>
        </Lesson>
    );
    if (small) return (
        <Lesson color={(specificSubstitutionType || {}).backgroundColor} flex={last}>
            <ColorBar lineColor={colorBar} />
            <LessonContainer small>
                {specificSubstitutionType &&
                    <SubstitutionType color={specificSubstitutionType.color}>{specificSubstitutionType.name}</SubstitutionType>}
                <Field1 />
                <Field3 />
                <Field2 />
                {removalField && <RemovalField />}
                {substitutionText && <SubstitutionText>{substitutionText}</SubstitutionText>}
            </LessonContainer>
        </Lesson>
    );
};

const ColorBar = styled.div`
    width: 3%;
    margin-right:5px;
    background-color: ${props => props.lineColor};
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
    color: ${props => props.color};
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
    background-color: ${props => props.color || indigo50};
`;

export default AbstractLesson;