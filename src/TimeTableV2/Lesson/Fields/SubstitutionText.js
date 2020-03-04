import React from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';
import useSpecificSubsitutionType from '../useSpecificSubsitutionType';


const useStyles = makeStyles(theme => ({
    root: {
        color: props => props.color,
        fontSize: theme.typography.pxToRem(12),
        fontWeight: 600,
    }
}), { name: "SubstitutionText" });

export default function SubstitutionText({ substitutionText, specificSubstitutionType }) {
    const styles = useSpecificSubsitutionType(specificSubstitutionType);
    const classes = useStyles(styles);

    const texts = [substitutionText, specificSubstitutionType && specificSubstitutionType.name]
        .sort((t1, t2) => (t1 ? t1.length : Infinity) - (t2 ? t2.length : Infinity));

    // use the text that is shorter
    
    const textMain = texts[0];
    const textTooltip = texts[1];

    return (
        <div className={classes.root}>
            {textTooltip ?
                <Tooltip title={textTooltip}>
                    <div>{textMain}</div>
                </Tooltip>
                : textMain
            }
        </div>
    )
}