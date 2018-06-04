import * as colors from '@material-ui/core/colors';
import { createMask, transform, fromViewer, addSubstitutionInformation } from './masks';

export const WEEKDAY_NAMES = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
export const DRAWER_WIDTH = 300;

const colorsArray = ["red", "pink", "purple", "deepPurple", "indigo", "blue", "cyan", "teal", "green", "lime", "yellow", "amber", "orange", "deepOrange", "brown", "blueGrey", "grey"];

export const SUBJECT_COLORS = colorsArray.map(color => colors[color][600]);

export const SUBJECTS = ["de", "inf", "en", "sp", "geo", "ph", "la", "ch", "ge", "bio", "ma", "ku", "ds", "mu", "fr", "ru", "pb", "sn", "ler", "rel", "wat"];

export const SUBJECT_COLORS_MAP = {};
SUBJECTS.forEach((subject, i) => {
    SUBJECT_COLORS_MAP[subject] = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
});


export function specifySubstitutionType(id, type, substitution) {
    let lesson = {};
    substitution = { ...substitution, id, type };
    lesson.specificSubstitutionType = getSpecificSubstitutionType(substitution);
    if (lesson.specificSubstitutionType && lesson.specificSubstitutionType.mask) {
        substitution = lesson.specificSubstitutionType.mask(substitution);
    }
    lesson.SUBJECT_ID_OLD = substitution.SUBJECT_ID;
    lesson.ROOM_ID_OLD = substitution.ROOM_ID;
    lesson.TEACHER_ID_OLD = substitution.TEACHER_ID;
    lesson.CLASS_IDS_OLD = substitution.CLASS_IDS;

    lesson.TEACHER_ID = substitution.TEACHER_ID_NEW;
    lesson.ROOM_ID = substitution.ROOM_ID_NEW;
    lesson.SUBJECT_ID = substitution.SUBJECT_ID_NEW;
    lesson.CLASS_IDS = substitution.CLASS_IDS_NEW;

    lesson.SUBJECT_ID_SUBSTITUTING = substitution.SUBJECT_ID_SUBSTITUTING;
    lesson.ROOM_ID_SUBSTITUTING = substitution.ROOM_ID_SUBSTITUTING;
    lesson.TEACHER_ID_SUBSTITUTING = substitution.TEACHER_ID_SUBSTITUTING;
    lesson.CLASS_IDS_SUBSTITUTING = substitution.CLASS_IDS_SUBSTITUTING;

    lesson.substitutionType = substitution.TYPE;
    lesson.substitutionText = substitution.TEXT;
    lesson.isOld = substitution.isOld;
    lesson.substitutionInfo = substitution.substitutionInfo;
    return lesson;
};
export function getSpecificSubstitutionType(substitution) {
    let substitutionType = SUBSTITUTION_MAP[substitution.TYPE];
    return substitutionType;
};

export const SUBSTITUTION_MAP = {
    SUBSTITUTION: {
        color: colors.red[900],
        backgroundColor: colors.red[50],
        name: "Vertretung",
        priority: 5,
        mask: createMask(fromViewer, addSubstitutionInformation)
    },
    ASSIGNMENT: {
        color: colors.yellow[900],
        backgroundColor: colors.yellow[50],
        name: "Aufgaben",
        priority: 4,
        mask: createMask(transform('old')),
    },
    ELIMINATION: {
        color: colors.green[900],
        backgroundColor: colors.green[100],
        name: "Entfall",
        mask: createMask(transform('old')),
    },
    CLASS_SUBSTITUTION: {
        color: "#a7bef7",
        name: "Klasse absent",
        mask: createMask(transform('new')),
    },
    ROOM_SUBSTITUTION: {
        color: colors.blue[900],
        backgroundColor: colors.lightBlue[50],
        name: "Raumvertretung",
        priority: 1,
        mask: createMask(fromViewer)
    },
    INFORMATION: {
        color: colors.green.A500,
        backgroundColor: colors.green[50],
        name: "Hinweis",
        mask: createMask(transform('new')),
    },
    SWAP: {
        color: colors.lime[900],
        backgroundColor: colors.lime[50],
        name: "Tausch"
    },
    EXTRA_LESSON: {
        color: colors.purple[900],
        backgroundColor: colors.purple[50],
        name: "Zusatzstunde"
    },
    SUPERVISION: {
        color: colors.grey[900],
        backgroundColor: colors.red[50],
        name: "Mitbetreuung",
        mask: createMask(fromViewer, addSubstitutionInformation)
    },
    REDUNDANCY: {
        color: colors.green[900],
        backgroundColor: colors.green[100],
        name: "Freistellung",
        mask: createMask(transform('old'))
    },
    UNKNOWN: {
        color: colors.grey[600],
        backgroundColor: colors.grey[100],
        name: "unbekannt",
    }
};

export const getSubstitutionsCacheKey = ({ id, type, week, year }) => `substitutions-${id}-${type}@${week}-${year}`;
export const getTimetableCacheKey = ({ id, type }) => `timetable-${id}-${type}`;