import React from 'react';
import { useTheme } from '@material-ui/core';


export default function useSpecificSubsitutionType(specificSubstitutionType) {
    const theme = useTheme();
    return React.useMemo(() => specificSubstitutionType ? specificSubstitutionType.style(theme) : {}, [specificSubstitutionType, theme]);
    
}
