import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Description from './description';

const extractClasses = (classes) => {
    classes = classes.map((_class) => {
        let split = _class.NAME.match(/[a-zA-Z]+|[0-9]+/g)
        return {
            grade: parseInt(split[0], 10),
            letter: { letter: split[1], id: _class},
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

// const combine = (oldClasses, newClasses) => {
//     Object.keys(oldClasses).forEach((key) => {
//         let oldElem = oldClasses[key];
//         let elem = newClasses[key];
//         oldElem.letters.forEach((letter) => {
//             letter.remove = elem.letters.filter(newLetter => newLetter.letter === letter.letter).length === 0;
//             letter.add = oldElem.letters.filter(oldLetter => letter.letter === oldLetter.letter).length === 0;
//         });
//     });
// };


const ClassesContainer = type => classes => ({ small, left, themeClasses, description, setTimeTable }) => {
    const Classes = (e) => (
        <Container left={left} className={themeClasses['classes']}>
            {Object.keys(e).map((key) => {
                let classes = e[key];
                return (
                    <ClassContainer key={key}>
                        <Grade>{key}</Grade>
                        {classes.letters.map((letter, i) =>
                            <Class key={letter.id.CLASS_ID} onClick={description && (() => (setTimeTable('class', letter.id.CLASS_ID)))}>
                                {letter.letter}
                            </Class>
                        )}
                    </ClassContainer>
                )
            })}
        </Container>
    );
    let extracted;
    if (type === 'new') {
        extracted = classes.new && extractClasses(classes.new);
    }
    if (type === 'old') {
        extracted = classes.old && extractClasses(classes.old);
    }
    if (type === 'instead-of' || type === 'instead-by') {
        extracted = classes.substitution && extractClasses(classes.substitution);
    }
    const output = Classes(extracted);
    const classCount = Object.values(extracted).reduce((prev, e) => prev + e.letters.length, 0);
    return description ?
        <Description classes={themeClasses} type="classes" label={"Klasse" + (classCount > 1 ? 'n' : '')}>
            {output}
        </Description>
        : output;
}

export const classStyles = theme => ({
    'classes': {

    },
});

ClassesContainer.propTypes = {
    Classes: PropTypes.object,
    small: PropTypes.bool,
};

const Container = styled.div`
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
    ${props => props.onClick && `cursor: pointer;`}
`;

export default ClassesContainer;
