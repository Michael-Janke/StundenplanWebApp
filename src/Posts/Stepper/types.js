import CreateIcon from '@material-ui/icons/Create';
import ImageIcon from '@material-ui/icons/Image';
import CollectionsIcon from '@material-ui/icons/Collections';

const types = {
    "TEXT": {
        value: "TEXT",
        label: "Text",
        description: `
            Schreibe einen Text
        `,
        icon: CreateIcon,
    },
    "PICTURE": {
        value: "PICTURE",
        label: "Bild",
        description: `
            Erstelle ein BIld
        `,
        icon: ImageIcon,
    },
    "DIASHOW": {
        value: "DIASHOW",
        label: "Diashow",
        description: `
            Erstelle eine Diashow
        `,
        icon: CollectionsIcon,

    }
}

export default types;