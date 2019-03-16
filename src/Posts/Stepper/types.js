import React from 'react';
import CreateIcon from '@material-ui/icons/Create';
import ImageIcon from '@material-ui/icons/Image';
import CollectionsIcon from '@material-ui/icons/Collections';
import { Typography } from '@material-ui/core';

const types = {
    TEXT: {
        value: 'TEXT',
        label: 'Text',
        description: (
            <>
                <Typography variant="h5" paragraph>
                    Schreibe einen Text
                </Typography>
                <Typography variant="body1" paragraph>
                    Erreiche Schüler und Lehrer mit einem einfachen Text.
                </Typography>
            </>
        ),
        icon: CreateIcon,
    },
    PICTURE: {
        value: 'PICTURE',
        label: 'Bild',
        description: (
            <>
                <Typography variant="h5" paragraph>
                    Erstelle ein Bild
                </Typography>
                <Typography variant="body1" paragraph>
                    Erreiche Schüler und Lehrer mit einem einfachen Bild.
                </Typography>
            </>
        ),
        icon: ImageIcon,
    },
    DIASHOW: {
        value: 'DIASHOW',
        label: 'Diashow',
        description: (
            <>
                <Typography variant="h5" paragraph>
                    Erstelle eine Diashow
                </Typography>
                <Typography variant="body1" paragraph>
                    Erreiche Schüler und Lehrer mit einer faszinierenden Diashow.
                </Typography>
            </>
        ),
        icon: CollectionsIcon,
    },
};

export default types;
