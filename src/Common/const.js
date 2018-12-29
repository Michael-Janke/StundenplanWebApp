import * as colors from '@material-ui/core/colors';
import { createMask, transform, fromViewer, addSubstitutionInformation, removeIf } from './masks';
import { darken } from '@material-ui/core/styles/colorManipulator';

export const WEEKDAY_NAMES = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];

const colorsArray = ["red", "pink", "purple", "deepPurple", "indigo", "blue", "cyan", "teal", "green", "lime", "yellow", "amber", "orange", "deepOrange", "brown", "blueGrey", "grey"];

export const SUBJECT_COLORS = colorsArray.map(color => colors[color][600]);

export const COLOR_STYLE_MAP = colorsArray.reduce((prev, current) => {
    prev[current] = { color: colors[current][600] };
    return prev;
}, {})

export const SUBJECTS = ["de", "inf", "en", "sp", "geo", "ph", "la", "ch", "ge", "bio", "ma", "ku", "ds", "mu", "fr", "ru", "pb", "sn", "ler", "rel", "wat"];

export const SUBJECT_COLORS_MAP = {};
SUBJECTS.forEach((subject, i) => {
    SUBJECT_COLORS_MAP[subject] = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
});

export function classNames(...classes) {
    if (!classes.length) return "";
    return classes.map(arg => {
        return (arg && typeof arg === 'object') ?
            Object.entries(arg).map(([key, entry]) => {
                return entry && key;
            }).filter(e => !!e)
                .join(" ")
            : arg;
    }).filter(e => !!e).join(" ");
}

function normalize(v) {
    return v || (v === 0 ? 0 : undefined);
}

export function specifySubstitutionType(id, type, substitution) {
    let lesson = {};
    substitution = { ...substitution, id, type };

    if (!substitution.isOld && substitution.TEXT === "Methodenkompetenz") {
        substitution.TYPE = "METH_COMP";
        substitution.TEXT = "";
    }
    lesson.specificSubstitutionType = getSpecificSubstitutionType(substitution);
    if (lesson.specificSubstitutionType && lesson.specificSubstitutionType.mask) {
        substitution = lesson.specificSubstitutionType.mask(substitution);
        if (substitution)
            lesson.specificSubstitutionType = getSpecificSubstitutionType(substitution);
    }

    if (!substitution) { return null; }
    lesson.SUBJECT_ID_OLD = normalize(substitution.SUBJECT_ID);
    lesson.ROOM_ID_OLD = normalize(substitution.ROOM_ID);
    lesson.TEACHER_IDS_OLD = substitution.TEACHER_ID ? [substitution.TEACHER_ID] : [];
    lesson.CLASS_IDS_OLD = substitution.CLASS_IDS;

    lesson.TEACHER_IDS = substitution.TEACHER_ID_NEW ? [substitution.TEACHER_ID_NEW] : [];
    lesson.ROOM_ID = normalize(substitution.ROOM_ID_NEW);
    lesson.SUBJECT_ID = normalize(substitution.SUBJECT_ID_NEW);
    lesson.CLASS_IDS = substitution.CLASS_IDS_NEW;

    lesson.SUBJECT_ID_SUBSTITUTING = substitution.SUBJECT_ID_SUBSTITUTING;
    lesson.ROOM_ID_SUBSTITUTING = substitution.ROOM_ID_SUBSTITUTING;
    lesson.TEACHER_IDS_SUBSTITUTING =
        substitution.TEACHER_ID_SUBSTITUTING ? [substitution.TEACHER_ID_SUBSTITUTING] : [];
    lesson.CLASS_IDS_SUBSTITUTING = substitution.CLASS_IDS_SUBSTITUTING;

    lesson.substitutionType = substitution.TYPE;
    lesson.substitutionText = window.params.sortBy !== 'teacher' ?
        substitution.TEXT : substitution.TEXT_TEACHER;
    lesson.isOld = substitution.isOld;
    lesson.substitutionInfo = substitution.substitutionInfo;
    return lesson;
};
export function getSpecificSubstitutionType(substitution) {
    let substitutionType = SUBSTITUTION_MAP[substitution.TYPE];
    return substitutionType;
};

function bgColor(type, color) {
    return darken(color, type === 'dark' ? 0.6 : 0);
}

export const SUBSTITUTION_MAP = {
    SUBSTITUTION: {
        style: theme => ({
            color: colors.red[theme.palette.type === 'dark' ? 300 : 900],
            backgroundColor: bgColor(theme.palette.type, colors.red[50]),
        }),
        name: "Vertretung",
        priority: 5,
        mask: createMask(fromViewer, addSubstitutionInformation, removeIf('room'))
    },
    INSTEAD_OF: {
        style: theme => ({
            color: colors.grey[600],
            backgroundColor: bgColor(theme.palette.type, colors.grey[100]),
        }),
        name: "vertreten durch",
    },
    ASSIGNMENT: {
        style: theme => ({
            color: colors.yellow[900],
            backgroundColor: bgColor(theme.palette.type, colors.yellow[50]),
        }),
        name: "Aufgaben",
        priority: 4,
        mask: createMask(transform('old'), removeIf('room')),
    },
    ELIMINATION: {
        style: theme => ({
            color: colors.green[theme.palette.type === 'dark' ? 300 : 900],
            backgroundColor: bgColor(theme.palette.type, colors.green[100]),
        }),
        name: "Entfall",
        mask: createMask(transform('old'), removeIf('room')),
    },
    CLASS_SUBSTITUTION: {
        style: theme => ({
            color: "#a7bef7",
        }),
        name: "Klasse absent",
        mask: createMask(transform('new'), removeIf('room')),
    },
    ROOM_SUBSTITUTION: {
        style: theme => ({
            color: theme.palette.type === 'dark' ? colors.cyan[600] : colors.blue[900],
            backgroundColor: bgColor(theme.palette.type, colors.lightBlue[50]),
        }),
        name: "Raumvertretung",
        priority: 1,
        mask: createMask(fromViewer, removeIf('room'))
    },
    INFORMATION: {
        style: theme => ({
            color: colors.lime[700],
            backgroundColor: bgColor(theme.palette.type, colors.green[50]),
        }),
        name: "Hinweis",
        mask: createMask(transform('new'), removeIf('room')),
    },
    SWAP: {
        style: theme => ({
            color: colors.lime[900],
            backgroundColor: bgColor(theme.palette.type, colors.lime[50]),
        }),
        name: "Tausch"
    },
    EXTRA_LESSON: {
        style: theme => ({
            color: theme.palette.type === 'dark' ? colors.purple[400] : colors.purple[900],
            backgroundColor: bgColor(theme.palette.type, colors.purple[50]),
        }),
        name: "Zusatzstunde"
    },
    METH_COMP: {
        style: theme => ({
            color: theme.palette.type === 'dark' ? colors.purple[400] : colors.purple[900],
            backgroundColor: bgColor(theme.palette.type, colors.purple[50]),
        }),
        name: "Methodenkompetenz",
        mask: createMask(fromViewer, addSubstitutionInformation, removeIf('room'))
    },
    SUPERVISION: {
        style: theme => ({
            color: theme.palette.type === 'dark' ? colors.grey[300] : colors.grey[900],
            backgroundColor: bgColor(theme.palette.type, colors.red[50]),
        }),
        name: "Mitbetreuung",
        mask: createMask(fromViewer, addSubstitutionInformation, removeIf('room'))
    },
    REDUNDANCY: {
        style: theme => ({
            color: theme.palette.type === 'dark' ? colors.green[300] : colors.green[900],
            backgroundColor: bgColor(theme.palette.type, colors.green[100]),
        }),
        name: "Freistellung",
        mask: createMask(transform('old'), removeIf('room'))
    },
    UNKNOWN: {
        style: theme => ({
            color: colors.grey[600],
            backgroundColor: bgColor(theme.palette.type, colors.grey[100]),
        }),
        name: "unbekannt",
        mask: createMask(transform('old'), removeIf('room'))
    }
};

export const getSubstitutionsCacheKey = ({ id, type, week, year }) => `substitutions-${id}-${type}@${week}-${year}`;
export const getTimetableCacheKey = ({ id, type }) => `timetable-${id}-${type}`;