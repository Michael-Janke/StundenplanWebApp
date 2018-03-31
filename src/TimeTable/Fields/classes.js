import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const joinClasses = (classes) => {
    if (classes.length === 0) return "";
    if (classes.length === 1) return classes[0].NAME;
    classes = classes.map((_class) => {
        let split = _class.NAME.match(/[a-zA-Z]+|[0-9]+/g)
        return {
            grade: split[0],
            letter: split[1]
        }
    });
    classes.sort((a, b) => {
        if (a.grade < b.grade) return -1;
        if (a.grade > b.grade) return 1;
        if (a.letter < b.letter) return -1;
        if (a.letter > b.letter) return 1;
        return 0;
    });

    let outcome = "";
    classes.reduce((prev, _class) => {
        if (!prev || prev.grade !== _class.grade) {
            outcome += _class.grade;
        }
        outcome += _class.letter;
        return _class;
    }, null);
    return outcome;
}

const extractClasses = (classes, old) => {
    classes = classes.map((_class) => {
        let split = _class.NAME.match(/[a-zA-Z]+|[0-9]+/g)
        return {
            grade: split[0],
            letters: [{ letter: split[1] }]
        }
    });

    classes.sort((a, b) => {
        if (a.grade < b.grade) return -1;
        if (a.grade > b.grade) return 1;
        if (a.letter < b.letter) return -1;
        if (a.letter > b.letter) return 1;
        return 0;
    });

    let outcome = [];
    outcome.push(classes.reduce((prev, current) => {
        if (current.grade === prev.grade) {
            prev.letters = [...prev.letters, ...current.letters];
            return prev;
        } else {
            outcome.push(prev);
            return current;
        }
    }));
    return outcome;
}



function ClassesContainer({ classes, small }) {
    const NormalClass = !!classes.old ? NewClass : Class;
    return (
        <Container>
            {classes.new.map((element, i) => <NormalClass key={i}>{element.NAME}</NormalClass>)}
            {classes.old && classes.old.map((element, i) => <OldClass key={"o" + i}>{element.NAME}</OldClass>)}
        </Container>
    )
}

ClassesContainer.propTypes = {
    Classes: PropTypes.object,
    small: PropTypes.bool,
};

const Container = styled.div`
    flex-direction: column;
    display: flex;
    align-items: flex-end;
`;

const Class = styled.div`
    font-size: 70%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const NewClass = styled(Class) `
`;

const OldClass = styled(Class) `
    font-size: 50%;
    text-decoration: line-through;
`;


export default ClassesContainer;
