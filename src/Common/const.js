import * as colors from '@material-ui/core/colors';

export const WEEKDAY_NAMES = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
export const DRAWER_WIDTH = 300;

const colorsArray = ["red", "pink", "purple", "deepPurple", "indigo", "blue", "cyan", "teal", "green", "lime", "yellow", "amber", "orange", "deepOrange", "brown", "blueGrey", "grey"];

export const SUBJECT_COLORS = colorsArray.map(color => colors[color][600]);

export const SUBJECTS = ["de", "inf", "en", "sp", "geo", "ph", "la", "ch", "ge", "bio", "ma", "ku", "ds", "mu", "fr", "ru", "pb", "sn", "ler", "rel", "wat"];

export const SUBJECT_COLORS_MAP = {};
SUBJECTS.forEach((subject, i) => {
    SUBJECT_COLORS_MAP[subject] = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
});

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
    },
    ASSIGNMENT: {
        color: colors.yellow[900],
        backgroundColor: colors.yellow[50],
        name: "Aufgaben",
        priority: 4,
    },
    ELIMINATION: {
        color: colors.green[900],
        backgroundColor: colors.green[100],
        name: "Entfall",
    },
    CLASS_SUBSTITUTION: {
        color: "#a7bef7",
        name: "Klasse absent"
    },
    ROOM_SUBSTITUTION: {
        color: colors.blue[900],
        backgroundColor: colors.lightBlue[50],
        name: "Raumvertretung",
        priority: 1,
    },
    INFORMATION: {
        color: colors.green.A500,
        backgroundColor: colors.green[50],
        name: "Hinweis",
    },
    SWAP: {
        color: colors.lime[900],
        backgroundColor: colors.lime[50],
        name: "Tausch"
    },
    EXTRA_LESSON: {
        colors: colors.purple[900],
        backgroundColor: colors.purple[50],
        name: "Zusatzstunde"
    },
    SUPERVISION: {
        color: colors.grey[900],
        name: "Mitbetreuung",
    },
    REDUNDANCY: {
        color: colors.green[900],
        backgroundColor: colors.green[100],
        name: "Freistellung"
    }
};

export const getSubstitutionsCacheKey = ({ id, type, week, year }) => `substitutions-${id}-${type}@${week}-${year}`;
export const getTimetableCacheKey = ({ id, type }) => `timetable-${id}-${type}`;