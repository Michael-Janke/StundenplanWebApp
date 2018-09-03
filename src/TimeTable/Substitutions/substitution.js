import React from 'react';
import { getFields, styles } from '../Fields';
import styled from 'styled-components';
import indigo from '@material-ui/core/colors/indigo';
import withStyles from '@material-ui/core/styles/withStyles';
import grey from '@material-ui/core/colors/grey';
import ActionInfo from '@material-ui/icons/Info';


const Field = (field, props, customProps) => (
    <SubstitutionField>
        {React.createElement(field, { ...props, ...customProps })}
    </SubstitutionField>
);
const BindField = (props) => field => Field.bind(null, field, props);

const SubstitutionEntry = (props) => {
    const { substitution, type, classes, theme } = props;
    const { substitutionText, specificSubstitutionType, period, substitutionInfo } = substitution;
    const { fields } = getFields(type)(substitution);
    const styles = specificSubstitutionType ? specificSubstitutionType.style(theme) : {};
    const colorBar = styles.color;
    const isNew = fields.new;
    const isOld = fields.old;

    const BoundField = BindField({ themeClasses: classes, left: true, small: true });

    const NewFields = fields.new && fields.new.map(BoundField);
    const OldFields = fields.old && fields.old.map(BoundField);

    const SubstitutingFields = fields.substitution && fields.substitution.map(BoundField);
    let substitutionTextBig = substitutionText && substitutionText.length > 5;

    const substitutionType = specificSubstitutionType && (
        <SubstitutionType color={isOld ? grey[700] : styles.color}>
            {(!substitutionText || substitutionTextBig) ? specificSubstitutionType.name : substitutionText}
        </SubstitutionType>
    );

    const extraInfo = (substitutionTextBig) && (
        <SubstitutionText>
            {substitutionText}
        </SubstitutionText>
    );

    let InsteadBy = substitutionInfo === 'instead-by' ?
        (
            <SubstitutionRow>
                <InsteadInformation>durch:</InsteadInformation>
                <SubstitutionContent>
                    {SubstitutingFields.map((Field, i) => <Field key={i} />)}
                    <SubstitutionField />
                </SubstitutionContent>
            </SubstitutionRow>
        )
        : null;

    let InsteadOf = substitutionInfo === 'instead-of' ?
        (
            <SubstitutionRow>
                <InsteadInformation>statt:</InsteadInformation>
                <SubstitutionContent>
                    {SubstitutingFields.map((Field, i) => <Field key={i} />)}
                    <SubstitutionField />
                </SubstitutionContent>
            </SubstitutionRow>
        )
        : null;

    const New = isNew ? () => {
        const [Field1, Field2, Field3] = NewFields;
        return (
            <SubstitutionRow>
                <SubstitutionContent>
                    <Field1 />
                    <Field2 />
                    <Field3 />
                </SubstitutionContent>
            </SubstitutionRow>
        );
    } : null;

    const Old = isOld ? () => {
        const [Field1, Field2] = OldFields;
        return (
            <SubstitutionRow>
                <SubstitutionContent className={classes.substitutionsContentOld}>
                    <Field1 />
                    <Field2 />
                    <SubstitutionField />
                </SubstitutionContent>
            </SubstitutionRow>
        );
    } : null;


    return (
        <SubstitutionRow>
            <ColorBar lineColor={colorBar} />
            <Period>{period}</Period>
            {substitutionType}
            <SubstitutionContainer>
                {New && New()}
                {InsteadOf}
                {Old && Old()}
                {InsteadBy}
                {extraInfo}
            </SubstitutionContainer>
        </SubstitutionRow>
    );
};

const Period = styled.div`
    font-size: 100%;
    font-weight: 600;
    margin-right: 8px;
`;

const SubstitutionText = ({ children }) => (
    <SubstitutionTextContainer>
        <ActionInfo style={{ fontSize: '100%', marginRight: '0.3vmin' }} />
        <div style={{ flex: 1 }}>{children}</div>
    </SubstitutionTextContainer>
);

const SubstitutionTextContainer = styled.div`
    font-size: 50%;
    white-space: normal;
    align-items: center;
    display: flex;
    margin: 0 8px 8px;
`;


const InsteadInformation = styled.div`
    font-size: 50%;
    font-weight: 600;
    color: ${grey[400]};
    margin: 0 4px;
    text-align: right;
`;

const SubstitutionContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-size: inherit;
    flex: 1;
`;

const SubstitutionField = styled.div`
    flex: 1;
    overflow: hidden;
    display: flex;
    justify-content: center;
`;


const SubstitutionRow = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 2px;
`;

const SubstitutionContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    flex: 2;
    overflow: hidden;

`;

const SubstitutionType = styled.div`
    flex: 1;
    font-size: 60%;
    font-weight: 600;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: ${props => props.color};
`;


const ColorBar = styled.div`
    width: 2px;
    margin-right:5px;
    background-color: ${props => props.lineColor || indigo[100]};
    align-self: normal;
`;

const extendStyles = (theme) => ({
    ...(styles(theme)),
    substitutionsContentOld: {
        textDecoration: 'line-through ' + (theme.palette.type === 'dark' ? "white" : "black"),
    }
})

export default withStyles(extendStyles, { withTheme: true })(SubstitutionEntry);