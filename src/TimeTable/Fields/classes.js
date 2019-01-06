import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Description from './description';

const extractClasses = (classes) => {
    classes = classes.map((_class) => {
        let split = _class.NAME.match(/[a-zA-Z]+|[0-9]+/g)
        return {
            grade: parseInt(split[0], 10),
            letter: { letter: split[1], id: _class },
        }
    });
    return classes.reduce((prev, current) => {
        let object = prev[current.grade];
        if (!object) {
            object = prev[current.grade] = { letters: [] };
        }
        object.letters.push(current.letter);
        return prev;
    }, {});
}
function Container({ className, description, type, children, setTimeTable, classes }) {
    if (description) {
        return classes.map((klass) => (
            <Description
                key={klass.CLASS_ID}
                onClick={(() => setTimeTable('class', klass.CLASS_ID))}
                type="class"
                instead={type}>
                {klass.NAME}
            </Description>
        ));
    }
    const extracted = extractClasses(classes);
    return (
        <div className={className}>
            <CContainer className={className}>
                {Object.keys(extracted).map((key) => {
                    let classes = extracted[key];
                    return (
                        <ClassContainer key={key}>
                            <Grade>{key}</Grade>
                            {classes.letters.map((letter, i) =>
                                <Class key={letter.id.CLASS_ID}>
                                    {letter.letter}
                                </Class>
                            )}
                        </ClassContainer>
                    )
                })}
            </CContainer>
        </div>
    )
}

const ClassesContainer = type => classes => ({ small, left, themeClasses, description, setTimeTable }) => {
    let field;
    if (type === 'new') {
        field = classes.new;
    }
    if (type === 'old') {
        field = classes.old;
    }
    if (type === 'instead-of' || type === 'instead-by') {
        field = classes.substitution;
    }
    return (
        <Container
            setTimeTable={setTimeTable}
            description={description}
            classes={field}
            className={themeClasses['classes']}>
        </Container>
    );
}

export const classStyles = theme => ({
    'classes': {

    },
});

ClassesContainer.propTypes = {
    Classes: PropTypes.object,
    small: PropTypes.bool,
};

const CContainer = styled.div`
    flex-direction: column;
    display: flex;
    // ${props => !props.left && `align-items: flex-end`};
`;
const ClassContainer = styled.div`
    display: flex;
    align-items: flex-end;
`;

const Grade = styled.div`
    font-size: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const Class = styled.div`
    font-size: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

export default ClassesContainer;
